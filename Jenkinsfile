#!/usr/bin/env groovy

NS='xjoin-search-pr'

node('nodejs') {

    env.NODEJS_HOME = "${tool 'node-14'}"
    env.PATH="${env.NODEJS_HOME}/bin:${env.PATH}"

    checkout scm
    def utils = load "./build/utils.groovy"
    sh 'git rev-parse HEAD'

    stage('Build') {
        sh 'npm ci'
        sh 'npm run compile'
    }

    stage('Checkstyle') {
        sh 'npm run lint'
    }

    utils.withScaledEnv(NS) {
        env.ES_NODES="http://elasticsearch.${NS}.svc:9200"

        stage('Verify') {
            sh 'npm run verify'
        }
    }
}
