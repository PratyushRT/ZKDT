import random
import json

def generate_dt(depth):
	attributes = []
	thresholds = []
	dt=[]
	length_dt = pow(2, depth+1) -1

	for i in range(depth):
		attributes.append(i+1)
		thresholds.append(100*(i+1))

	level = 0
	k=0
	while(level<=depth-1):

		j=0
		for i in range(k, k+pow(2, level)):
				dt.append([i,attributes[level],thresholds[level]+j*10])
				j+=1

		k += pow(2, level)
		level+=1


	index = pow(2, depth)

	for i in range(pow(2, depth)):

		dt.append([-1, index-1 +i, i+1])

	return(dt)

def class_from_input(dt, input_attributes):

    #assuming input_attributes is sorted in the order it appears in the dt

    i = len(input_attributes)-1;
    curr_node = 0;

    while(i>=0):

        if(input_attributes[i]<dt[curr_node][2]):
            curr_node = 2*curr_node + 1
        else:
            curr_node = 2*curr_node + 2
        i=i-1

    return [dt[curr_node][1], dt[curr_node][2]];
    #returns index, class

def gen_input(dt, depth):

	input_attributes = []

	for i in range(depth):
		input_attributes.append(random.randint(i*100 + 1, (depth)*100-1))

	return(input_attributes)		

depth = 10
dt = generate_dt(depth)
k = gen_input(dt,depth)

print("Decision tree depth = " + str(depth))

print("Total number of decision tree classes = " + str(pow(2, depth)))

print(dt)



arr = k[::-1]
print(arr)
print(class_from_input(dt, arr))

with open('dt_.json', 'w') as f:
    json.dump(dt, f)


with open('input_attributes_.json', 'w') as f:
    json.dump(arr, f)