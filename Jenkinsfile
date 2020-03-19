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
				sh "node --max_old_space_size=4096 ./node_modules/@angular/cli/bin/ng build --prod"
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
