# #!/bin/bash
tput setaf 2;echo "Compiling circuit"
circom AuthenticatedDT.circom --r1cs --wasm --sym --c
tput setaf 2;echo "Reading DT, input and generating commitment to DT"
sleep 2
node adt.js
tput setaf 2;echo "Computing witness"
sleep 2
cd AuthenticatedDT_js
node generate_witness.js AuthenticatedDT.wasm input.json witness.wtns
tput setaf 2;echo "Witness successfully generated!"