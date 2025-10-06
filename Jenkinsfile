pipeline {
	agent any
  environment {
		REGISTRY      = 'docker.io/coderey'
    IMAGE         = "${REGISTRY}/adf-fe"                    // repo FE di Docker Hub
    SHORT         = "${env.GIT_COMMIT?.take(7)}"
    TAG           = "${env.BRANCH_NAME == 'main' ? 'prod-' : 'stg-'}${SHORT}"
    SERVER        = 'root@154.26.131.186'                   // SSH target VPS
    API_BASE_URL  = 'http://154.26.131.186:8080/api'        // FE butuh /api (umumnya)
  }
  stages {
		stage('Checkout') { steps { checkout scm } }

    stage('Build Image') {
			steps {
				sh """
          docker build \
            --build-arg NEXT_PUBLIC_API_BASE_URL="${API_BASE_URL}" \
            -t ${IMAGE}:${TAG} -f Dockerfile .
        """
      }
    }

    stage('Login & Push') {
			steps {
				withCredentials([usernamePassword(credentialsId: 'docker-registry-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
					sh """
            echo "$PASS" | docker login -u "$USER" --password-stdin
            docker push ${IMAGE}:${TAG}
          """
        }
      }
    }

    stage('Deploy') {
			when { anyOf { branch 'main'; branch 'staging' } }
      steps {
				sshagent (credentials: ['deploy-ssh-key']) {
					sh """
            ssh -o StrictHostKeyChecking=no ${SERVER} << 'EOS'
              set -e
              cd /opt/warehouse/deploy
              export FRONTEND_TAG='${TAG}'
              docker compose pull frontend
              docker compose up -d frontend
            EOS
          """
        }
      }
    }
  }
}
