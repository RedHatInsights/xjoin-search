FROM registry.access.redhat.com/ubi8/ubi-minimal:latest

ARG BUILD_COMMIT=unknown

# install packages from centos if not building on RHSM system
RUN FULL_RHEL=$(microdnf repolist --enabled | grep rhel-8) ; \
    if [ -z "$FULL_RHEL" ] ; then \
        rpm -Uvh http://mirror.centos.org/centos/8-stream/BaseOS/x86_64/os/Packages/centos-stream-repos-8-4.el8.noarch.rpm \
                 http://mirror.centos.org/centos/8-stream/BaseOS/x86_64/os/Packages/centos-gpg-keys-8-4.el8.noarch.rpm && \
        sed -i 's/^\(enabled.*\)/\1\npriority=200/;' /etc/yum.repos.d/CentOS*.repo ; \
    fi

RUN microdnf module enable nodejs:14 && \
    microdnf install --setopt=tsflags=nodocs -y nodejs git && \
    microdnf install -y rsync tar procps-ng && \
    microdnf upgrade -y && \
    microdnf clean all

WORKDIR /opt/app-root/src

COPY package.json package-lock.json /opt/app-root/src/

# This line is for 'json-schema-to-es'.
# The repo is public, this avoids needing a secret key unnecessarily.
RUN git config --global url."https://github.com/".insteadOf ssh://git@github.com/
RUN npm ci --only=production --ignore-scripts

COPY . /opt/app-root/src

RUN npm i typescript@4.3.5 && npm run compile

EXPOSE 4000
ENV NODE_ENV=production \
    BUILD_COMMIT=${BUILD_COMMIT}

CMD [ "node", "dist/src/app.js" ]
