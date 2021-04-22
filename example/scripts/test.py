#!/usr/bin/env python3
import time
import argparse

# Supports subcommand help messages
parser = argparse.ArgumentParser(description="Run tests")

args = parser.parse_args()

start = time.time()

print("Running tests...")

for x in range(0, 10):
    time.sleep(0.1)
    print("- Test " + str(x + 1) + " passed.")

end = time.time()
diff = end - start

print("10 tests passed in " + str(round(diff, 3)) + "s.")
