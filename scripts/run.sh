#!/bin/bash

# Run the ReactJS web server locally for development.

# Get the path to parent directory of this script.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )"/.. && pwd )"
cd $DIR # Go to the project top level dir.

# For local testing, with a local flask Data_API service running.
export REACT_APP_FLASK_URL=http://localhost:5000

#debugrob: don't check in with below commented!!  comment above, uncomment below
# For running react locally, but using the gcloud hosted flask Data_API
#export REACT_APP_FLASK_URL=https://dataapiv40-dot-openag-v1.appspot.com

cd react

npm start

