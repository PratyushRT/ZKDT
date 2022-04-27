const mimc = require('./mimc.js');
const fs = require('fs');


function ADT_from_DT(dt, r) {
    N = dt.length;
    (ADT = []).length = N;
    ADT.fill(0);
    i = N - 1;
    while (i >= 0) {
        // if (dt[i][1] == -1 && dt[i][2] == -1) {
        if (dt[i][0] == -1) {
            inputs = [dt[i][1], dt[i][2]];
            ADT[i] = mimc.mimcSponge(inputs, 1, 220, 0);
        } else {
            inputs = [BigInt(ADT[2 * i + 1]), BigInt(ADT[2 * i + 2]), dt[i][0], dt[i][1], dt[i][2]];
            ADT[i] = mimc.mimcSponge(inputs, 1, 220, 0);
        }
        i = i - 1;
    }
    (ADT_r = []).length = N + 2;
    ADT_r.fill(BigInt(0));
    for (let j = 3; j < N + 2; j++) {
        ADT_r[j] = ADT[j - 2];
    }
    //ADT_r[3:N+2] = ADT[1:N];
    ADT_r[1] = r;
    ADT_r[2] = ADT[0];
    inputs = [BigInt(ADT_r[2]), BigInt(ADT_r[1])];
    ADT_r[0] = mimc.mimcSponge(inputs, 1, 220, 0);
    return ADT_r;
}

function witness_path(dt, index) {
    i = index;
    path = [];
    while (i != 0) {
        if (i % 2 == 0) {
            path.push(dt[i - 1]);
            i = i / 2 - 1;
        } else {
            path.push(dt[i + 1]);
            i = (i - 1) / 2;
        }
    }
    return path;
}

function sibling(index){
    i = index;

    if (i%2==0){return i-1;}
    else{return i+1;}

}

function circuitInputs(adt, dt, index, input_attributes){

    pathElements=[]; 
    pathIndices =[];
    nodeVals= [];
    nodeAttributes = [];
    nodeThresholds = [];
    leaf = String(adt[index+2]);
    root = String(adt[0]);
    randomness = String(mimc.mimcSponge([1, 1], 1, 220, 0));

    wit_path = witness_path(dt, index);

    i=0;
    while (i<=wit_path.length-1){

        var path_node_val = wit_path[i][1];


        pathElements.push("\"" + String(adt[path_node_val+2]) + "\""); //works

        pathIndex = 1- (wit_path[i][1] % 2); //if wit_path[1]%2 is 1 then its a left node-> pathIndex =0 and vice-versa
        pathIndices.push(pathIndex);

        curr_node_val = parseInt(wit_path[i][1])%2;

        nodeVals.push(curr_node_val);

        nodeThresholds.push(dt[curr_node_val][2]);

        nodeAttributes.push(i+1);

        

        i+=1;
    }
    nodeAttributes.reverse();

    
    var str_leaf = "{ \"leaf\": \"" + leaf + "\",\n";
    var str_root = "\"root\": \"" + root + "\",\n";
    var str_pe = "\"pathElements\": [" + String(pathElements) +"],\n";
    var str_pi = "\"pathIndices\":[" + String(pathIndices) +"],\n";
    var str_nv = "\"nodeVals\":[" + String(nodeVals) + "],\n";
    var str_na = "\"nodeAttributes\":[" + String(nodeAttributes) + "],\n";
    var str_ia = "\"inputAttributes\": [" + String(input_attributes) + "],\n";
    var str_nt = "\"nodeThresholds\": [" + String(nodeThresholds) + "],\n";
    var str_r = "\"randomness\": \"" + randomness + "\"}";

    let data = str_leaf + str_root + str_pe + str_pi + str_nv + str_na + str_ia + str_nt + str_r;
    fs.writeFileSync("AuthenticatedDT_js/input.json", data);


    return root;

}

function class_from_input(dt, input_attributes){

    //assuming input_attributes is sorted in the order it appears in the dt

    i = input_attributes.length-1;
    curr_node = 0;

    while(i>=0){

        if(input_attributes[i]<dt[curr_node][2]){
            curr_node = 2*curr_node + 1;
        } else{
            curr_node = 2*curr_node + 2;
        }
        i=i-1;

    }

    return [dt[curr_node][1], dt[curr_node][2]];
    //returns index, class
}

//take dt and input_attributes as input from file
//print class
//write input to input.json done
//write script for above + upto circom compute witness


//enter decision trees in form [i, attribute, threshold], for leaf/class nodes [-1, i, class]
r = mimc.mimcSponge([1,1],1,220,0);
// console.log(ADT_from_DT([[0, 1, 6], [1 , 2, 60], [2, 2, 60], [-1, 3, 1], [-1, 4, 2], [-1, 5, 3], [-1, 6, 4]], BigInt(20236520550141562661255685148699579042199650049962373804338367805368772612215)));

const data = fs.readFileSync("dt.json");
const input = fs.readFileSync("input_attributes.json")

dt = JSON.parse(data);

input_att = JSON.parse(input)


adt = ADT_from_DT(dt, r);
res = class_from_input(dt, input_att);

index = res[0];
class_ = res[1];

console.log("Commitment to DT: " + String(circuitInputs(adt, dt, index, input_att)));


console.log("DT classification of input:" +String(class_));


