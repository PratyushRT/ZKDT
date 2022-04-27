import mimcSponge from "./mimc.js";

function ADT_from_DT(dt, r){
    N = dt.length;
    (ADT = []).length = N; ADT.fill(0);
    i = N-1;
    while (i>=0){
        if (dt[i][1] == -1 && dt[i][2]==-1){
            inputs = [i,dt[i][4]];
            ADT[i] = mimcSponge(inputs,1,220,0);
        }
        else {
            inputs = [ADT[2*i+1],ADT[2*i+2],i,dt[i][3],dt[i][4]];
            ADT[i] = mimcSponge(inputs, 1, 220, 0);
        }
        i = i - 1;
    }
    (ADT_r = []).length = N+2; ADT_r.fill(0);
    for(let j = 3;j<N+2;j++){
        ADT_r[j] = ADT[j-2];
    }
    //ADT_r[3:N+2] = ADT[1:N];
    ADT_r[2] = r;
    ADT_r[1] = ADT[0];
    inputs = [ADT[1],ADT[2]];
    ADT_r[0] = mimcSponge(inputs,1,220,0);
    return ADT_r;
}

function witness_path(dt,index){
    i = index;
    path = [];
    while (i!=0){
        if (i%2 == 0){
            path.push(dt[i-1]);
            i = i/2 - 1;
        }
        else{
            path.push(dt[i+1]);
            i = (i-1)/2;
        }
    }
    return path;
}

