function wait_for_pod_to_be_created() {
  POD_NAME=$1
  # shellcheck disable=SC2034
}


source ${CICD_ROOT}/_common_deploy_logic.sh

# Deploy k8s resources for app without its dependencies
export BONFIRE_NS_REQUESTER="${JOB_NAME}-${BUILD_NUMBER}-unit"
NAMESPACE=$(bonfire namespace reserve)
DB_NAMESPACE=$NAMESPACE

set -x
bonfire process \
    $APP_NAME \
    --source=appsre \
    --ref-env insights-stage \
    --set-template-ref ${COMPONENT_NAME}=${GIT_COMMIT} \
    --set-image-tag $IMAGE=$IMAGE_TAG \
    --namespace $NAMESPACE \
    --no-get-dependencies \
    $COMPONENTS_ARG \
    $COMPONENTS_RESOURCES_ARG | oc apply -f - -n $NAMESPACE

#wait for es to start
for i in {1..120}; do
    POD_NAME=$(oc get pods --selector="statefulset.kubernetes.io/pod-name=xjoin-elasticsearch-es-default-0" -o name -n "$NAMESPACE")
    if [ -z "$POD_NAME" ]; then
      sleep 1
    else
        break
    fi
done
oc wait pods/xjoin-elasticsearch-es-default-0 --for=condition=Ready --timeout=300s -n "$NAMESPACE"

# Set up port-forward for ES
LOCAL_ES_PORT=$(python -c 'import socket; s=socket.socket(); s.bind(("", 0)); print(s.getsockname()[1]); s.close()')
oc port-forward svc/xjoin-elasticsearch-es-http $LOCAL_ES_PORT:9200 -n $NAMESPACE &
PORT_FORWARD_PID=$!

# Store ES access info to env vars
export ES_USERNAME=elastic
export ES_PASSWORD=$(oc get secret/xjoin-elasticsearch-es-elastic-user -o custom-columns=:data.elastic -n "$NAMESPACE"| base64 -d)
export ES_NODES="http://localhost:$LOCAL_ES_PORT"

npm ci
npm run compile
npm run seed
npm run verify
result=$?

mkdir -p $ARTIFACTS_DIR
cat << EOF > $ARTIFACTS_DIR/junit-dummy.xml
<testsuite tests="1">
    <testcase classname="dummy" name="dummytest"/>
</testsuite>
EOF

if [ $result -ne 0 ]; then
  echo '====================================='
  echo '====  ✖ ERROR: UNIT TEST FAILED  ===='
  echo '====================================='
  exit 1
fi
