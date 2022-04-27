# zk-dt-private
The goal of this project is to create a private decision tree as an input and to be able to demonstrate the proof of integrity of this decision tree's outputs without revealing anything about the decision tree. 

The inspiration for this project comes from the paper: https://dl.acm.org/doi/pdf/10.1145/3372297.3417278
The setup relies on a commitment to a decision tree, referred to as an Authenticated Decision Tree (ADT). 
Some naive approaches:
1. Hash the entire tree as a commitment, but then the witness would be large (the entire tree)
2. Build a Merkle hash tree on top of the decision tree, so that each node has a valid Merkle tree proof

Instead of the above, we can build an ADT that allows a proof to be contained in the information of a node alone.
