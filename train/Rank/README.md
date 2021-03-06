# ~~Retrieve and~~ Ranking

1. Create the training data file 
To see an example of a working training file, look at hist_questions.csv
notice that the syntax is a question, followed by an id of the entry in the collection that it matches, followed by the relevance of the entry
**(make sure to include quotations)**.

aka for 
`"What is Beringia","3","1"`
the question is **"What is Beringia"**, the id of the entry that matches is **"3"**, and the rating of the ranking is **"1"**.

(for my training set I only used the value 1)

*Note:
You can include more than one entry id and ranking relevancy per line (even though I only used one).
so 
`"What is Beringia","3","1","2","1","5","1"`
would also be valid, and would suggest the entries with ids **3,2,and 5** in the collection would match the question*

2. Training
to train the ranker for a specific collection run the following command
```bash
python ./train.py -u $watson_rr_username:$watson_rr_password -i hist_questions.csv -c $watson_rr_cluster_id -x {collection_name} -n "{ranker_name}"
```

3. Training Status
to see all of the rankers on the current cluster check
https://gateway.watsonplatform.net/retrieve-and-rank/api/v1/rankers/

and to see the status of your current ranker check (ranker-id can be found from above link)
https://gateway.watsonplatform.net/retrieve-and-rank/api/v1/rankers/{ranker-id}
