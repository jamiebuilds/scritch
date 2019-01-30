#!/bin/sh

start=$(date +%s)
echo "Building files..."

for i in $(seq 1 10); do
  sleep 0.1
  echo "- File $i built."
done

end=$(date +%s)
total=$((end-start))

echo "10 files built in $((total))s."
