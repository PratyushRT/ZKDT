# Zero-Knowledge Proofs for Decision Tree classification

The goal of this project is to let an owner of a decision tree produce a cryptographic commitment to it such that on a public input, the owner can prove the integrity of classification of this input to a particular class. The zero-knowledge proof takes as input public values such as commitment to the decision tree, the public input, the class the input is assigned under the decision tree, and private values from the decision tree and produces a proof. All while keeping the decision tree private.

The inspiration for this project comes from the paper: https://dl.acm.org/doi/pdf/10.1145/3372297.3417278

This project uses [circom](https://docs.circom.io/) for proofs, and the `mimcSponge` function in circom for hashing. Before running the demo on your computer please include the requisite circomlib location at the top of `AuthenticatedDT.circom` file in the `adt` folder. Also required is [Dark Forest's hashing package](https://www.npmjs.com/package/@darkforest_eth/hashing).

To generate proofs for a particular input on your decision tree, first enter your decision tree in the requisite format to `adt/dt.json`. The decision tree is represented as array of arrays where each array element represents a decision tree node in the format `[node_index, attribute, attribute_threshold]`. Leaf nodes follow format `[-1, node_index, class]`. By default `node_index` starts from `0` and `attribute` values start from `1`. Our implementation assumes a uniform, binary decision tree. The input attributes should be provided in file `adt/input_attributes.json` in a sorted format going from leaf to root of the decision tree. This is provided by the decision tree owner. However, in the paper, there is a shuffle proof that proves that the public input is a permutation of the sorted input attributes. We aim to implement shuffle proofs, proofs of decision tree accuracy on public dataset all while keeping the decision tree private.

A simple example can be run by running command `bash demo.sh` in the `adt` folder.
