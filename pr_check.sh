#!/bin/bash

# --------------------------------------------
# Options that must be configured by app owner
# --------------------------------------------
export APP_NAME="xjoin"  # name of app-sre "application" folder this component lives in
export COMPONENT_NAME="xjoin-search"  # name of app-sre "resourceTemplate" in deploy.yaml for this component
export IMAGE="quay.io/cloudservices/xjoin-search"  # image location on quay
export LC_ALL=en_US.utf-8
export LANG=en_US.utf-8
export APP_ROOT=$(pwd)
export WORKSPACE=${WORKSPACE:-$APP_ROOT}  # if running in jenkins, use the build's workspace
export IMAGE_TAG=$(git rev-parse --short=7 HEAD)
export GIT_COMMIT=$(git rev-parse HEAD)
export QUAY_EXPIRE_TIME="40d"

IQE_PLUGINS="xjoin"
IQE_MARKER_EXPRESSION=""
IQE_FILTER_EXPRESSION=""
IQE_CJI_TIMEOUT="30m"

DOCKERFILE="build/Dockerfile"

# ---------------------------
# We'll take it from here ...
# ---------------------------

# Get bonfire helper scripts
CICD_URL=https://raw.githubusercontent.com/RedHatInsights/bonfire/master/cicd
curl -s $CICD_URL/bootstrap.sh > .cicd_bootstrap.sh && source .cicd_bootstrap.sh

# build the PR commit image
source $CICD_ROOT/build.sh

# Run the unit tests
echo "RUNNING UNIT TEST"
source $APP_ROOT/unit_test.sh

# Run IQE tests
echo "RUNNING DEPLOY_EPHEMERAL_ENV"
export BONFIRE_NS_REQUESTER="${JOB_NAME}-${BUILD_NUMBER}-cji"
source $CICD_ROOT/deploy_ephemeral_env.sh

echo "RUNNING CJI_SMOKE_TEST"
source $CICD_ROOT/cji_smoke_test.sh

echo "RUNNING POST_TEST_RESULTS"
source $CICD_ROOT/post_test_results.sh
