#!/bin/bash

# Run the ReactJS web server locally for development.

# Get the path to parent directory of this script.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )"/.. && pwd )"
cd $DIR # Go to the project top level dir.

# For local testing, with a local flask Data_API service running.
#export REACT_APP_FLASK_URL=http://localhost:5000

# For running react locally, but using the gcloud hosted flask Data_API
#export REACT_APP_FLASK_URL=https://data_api-dot-openag-v1.appspot.com

# For running react locally, but using the OLD hosted flask api
export REACT_APP_FLASK_URL=https://flaskapi-dot-openag-v1.appspot.com

cd react_UI

npm start

