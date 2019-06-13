#!/bin/bash

for i in $(seq 31 34); do
  echo -e "\033[${i}mAnsi Code (${i})\033[0m"
done

echo -e "when ran on CI ansi characters should not be displayed."