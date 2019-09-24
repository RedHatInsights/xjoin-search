#!/usr/bin/env groovy

NS='xjoin-search-pr'

node('nodejs') {

    env.NODEJS_HOME = "${tool 'node-10'}"
    env.PATH="${env.NODEJS_HOME}/bin:${env.PATH}"

    checkout scm

    stage('Build') {
        sh 'npm ci'
        sh 'npm run compile'
    }

    stage('Checkstyle') {
        sh 'npm run lint'
    }
}
