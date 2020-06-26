NPM_CREDENTIALS_ID = '982beb9e-1cb8-4a93-90f7-2fd8dce6c097'
GITHUB_PACKAGES_CREDENTIALS_ID = 'github-access-token'

pipeline {
  agent {
    docker {
      image 'node:10'
      label 'docker'
    }
  }
  stages {
    stage('Install dependencies') {
      environment {
        NPM_TOKEN = credentials("$NPM_CREDENTIALS_ID")
        GITHUB_PACKAGES_TOKEN = credentials("$GITHUB_PACKAGES_CREDENTIALS_ID")
      }
      steps {
        sh 'npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN'
        sh 'npm config set //npm.pkg.github.com/:_authToken=$GITHUB_PACKAGES_TOKEN'
        sh 'yarn install'
      }
    }
    stage('Lint code') {
      steps {
        sh 'npm run lint --silent'
      }
    }
  }
}
