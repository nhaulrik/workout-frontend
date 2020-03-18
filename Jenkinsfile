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
				sh "ng build"
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
