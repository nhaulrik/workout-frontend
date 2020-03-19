pipeline {

	agent any
	stages {
		stage('INSTALL PACKAGES') {
			steps {
				sh "npm install"
			}
		}
		stage('BUILD APP') {
			steps {
				sh "npm run my-build"
			}
		}
		stage("BUILD DOCKER") {
			steps {
				script {
					dockerImageBuild = docker.build "angularapp" + ":latest"
				}
			}
		}
//    stage("DEPLOY DOCKER") {
//      steps {
//        sh "docker-compose up"
//      }
//    }
	}
}
