pipeline {
    agent any
    environment {
        registry = 'hanm13/verify-bot'
        registryCredential = 'dockerhub'
        dockerImage = ''
    }

    stages {
        stage('Build') {
            parallel {
                stage('NodeJs') {
                    agent {
                        docker {
                            image 'node'
                        }
                    }
                    steps {
                        sh 'node --version'
                    }
                }

                stage('Docker') {
                    agent {
                        docker {
                            image 'docker'
                        }
                    }
                    steps {
                        sh 'docker --version'
                    }
                }

            }
        }
        stage('Deploy') {
            steps{
                script {
                    docker.withRegistry( '', registryCredential ) {
                        dockerImage.push()
                    }
                }
            }
        }
        stage('Cleaning up') {
            steps{
                sh "docker rmi $registry:$BUILD_NUMBER"
            }
        }
    }
}