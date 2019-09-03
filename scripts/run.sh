#!/bin/bash

# Initialize command line arg default values
LOCAL=0

# Get command line arguments
POSITIONAL=()
while [[ $# -gt 0 ]]; do
  key="$1"

  case $key in
  --local)
    shift
    LOCAL=1
    ;;
  *)
    POSITIONAL+=("$1")
    shift
    ;;
  esac
done
set -- "${POSITIONAL[@]}"

# Get the path to parent directory of this script.
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
cd $DIR # Go to the project top level dir.


if [[ "$LOCAL" == 1 ]]; then
  # For local testing, with a local flask Data_API service running
  echo "***Using Local Data API***"
  export REACT_APP_FLASK_URL=http://localhost:5000
else
  # For running react locally, but using the gcloud hosted flask Data_API
  export REACT_APP_FLASK_URL=https://dataapiv40-dot-openag-v1.appspot.com
fi


cd react
npm start
