---
title: pgvector PostgreSQL extension
excerpt: Use the pgvector extension with your Timescale service
products: [cloud]
keywords: [services, settings, extensions, pgvector]
tags: [extensions, pgvector]
---

# The `pgvector` extension

The `pgvector` PostgreSQL extension helps you to store and search over machine
learning-generated embeddings. It provides different capabilities that allows
you to identify both exact and approximate nearest neighbors. It is designed to
work seamlessly with other PostgreSQL features, including indexing and querying.

For more information about these functions and the options available, see the
[pgvector][pgvector-repo] repository.

## Use the `pgvector` extension to create a `chatbot`

The `pgvector` PostgreSQL extension allows you to create, store, and query
OpenAI [vector embeddings][vector-embeddings] in Timescale. Learn how to use
[retrieval augmented generation (RAG)][rag-docs] to create a chatbot that combines
your data with ChatGPT using OpenAI and `pgvector`. RAG provides a solution to the
problem that a foundational model such as GPT-3 or GPT-4 could be missing some
information needed to give a good answer, because that information was not in the
dataset used to train the model. This can happen if the information is stored in
private documents or only became available recently.

### Prerequisites

Before you begin, make sure you have:

*   Installed Python.
*   Created a [Timescale][cloud-login] service.
*   Downloaded the cheatsheet when you created the service. This sheet contains
    the connection details for the database you want to use as a vector database.
*   Signed up for an [OpenAI developer account][openai-signup].
*   Created an API key and made a note of your OpenAI [API key][api-key].
    <Highlight type="note">
    If you are on a free plan there may be rate limiting for your API requests.
    </Highlight>
*   Clone the [Timescale pgvector repository][timescale-pgvector] repository.

<Procedure>

### Using the `pgvector` extension to create a chatbot

In this example, you create embeddings, insert the embeddings in Timescale and
query the embeddings in Timescale using `pgvector`. The content for the
embeddings is from the Timescale blog, specifically from the
[Developer Q&A][developer-qa] section, which features posts by Timescale users talking
about their real-world use cases.

1.  Create and activate a Python virtual environment:

    ```bash
    virtualenv pgvectorenv
    source pgvectorenv/bin/activate
    ```

1.  Set the environment variables for `OPENAI_API_KEY` and
    `TIMESCALE_CONNECTION_STRING`. In this example, to set the environment
    variables in macOS, open the `zshrc` profile. Replace
    `<OPENAI_API>`, and `<SERVICE_URL>` with your OpenAI API key and the service
    URL of your Timescale service:

    ```bash
    nano ~/.zshrc
    export OPENAI_API_KEY='<OPENAI_API>'
    export TIMESCALE_CONNECTION_STRING='<SERVICE_URL>'

    Update the shell with the new variables using `source ~/.zshrc`

1.  Confirm that you have set the environment variables using:

    ```bash
    echo $OPENAI_API_KEY
    echo $TIMESCALE_CONNECTION_STRING
    ```

1.  Install the required modules and packages using the `requirements.txt`. This
    file is located in the `vector-cookbook\openai_pgvector_helloworld`
    directory:

    ```bash
    pip install -r requirements.txt
    ```

1.  To create embeddings for your data using the OpenAI API, open an editor of
    your choice and create the `create_embeddings.py` file.

    ```python
    ###############################################################################
    # create_embeddings.py
    # This script creates OpenAI embedding vectors for content in a CSV file
    # and saves the results to a new CSV file with the embeddings included
    ###############################################################################
    import openai
    import os
    import pandas as pd
    import numpy as np
    import json
    import tiktoken

    # Get openAI api key by reading local .env file
    from dotenv import load_dotenv, find_dotenv
    _ = load_dotenv(find_dotenv()) 
    openai.api_key  = os.environ['OPENAI_API_KEY']

    # Load your CSV file into a pandas DataFrame
    df = pd.read_csv('blog_posts_data.csv')
    df.head()

    ###############################################################################
    # Helper functions to help us create the embeddings
    ###############################################################################
    # Calculate number of tokens for a string
    def num_tokens_from_string(string: str, encoding_name = "cl100k_base") -> int:
        if not string:
            return 0
        # Returns the number of tokens in a text string
        encoding = tiktoken.get_encoding(encoding_name)
        num_tokens = len(encoding.encode(string))
        return num_tokens

    # Calculate cost of embedding num_tokens
    # Assumes we're using the text-embedding-ada-002 model
    # See https://openai.com/pricing
    def get_embedding_cost(num_tokens):
    return num_tokens/1000*0.0001

    # Calculate total cost of embedding all content in the dataframe
    def get_total_embeddings_cost():
        total_tokens = 0
        for i in range(len(df.index)):
            text = df['content'][i]
            token_len = num_tokens_from_string(text)
            total_tokens = total_tokens + token_len
        total_cost = get_embedding_cost(total_tokens)
        return total_cost
    ###############################################################################

    # quick check on total token amount for price estimation
    total_cost = get_total_embeddings_cost()
    print("Estimated price to embed this content = $" + str(total_cost))

    ###############################################################################
    # Create new list with small content chunks to not hit max token limits
    # Note: the maximum number of tokens for a single request is 8191
    # https://openai.com/docs/api-reference/requests
    ###############################################################################

    # list for chunked content and embeddings
    new_list = []

    # Split up the text into token sizes of around 512 tokens
    for i in range(len(df.index)):
        text = df['content'][i]
        token_len = num_tokens_from_string(text)
        if token_len <= 512:
            new_list.append([df['title'][i], df['content'][i], df['url'][i], token_len])
        else:
            # add content to the new list in chunks
            start = 0
            ideal_token_size = 512
            # 1 token ~ 3/4 of a word
            ideal_size = int(ideal_token_size // (4/3))
            end = ideal_size
            #split text by spaces into words
            words = text.split()

            #remove empty spaces
            words = [x for x in words if x != ' ']

            total_words = len(words)
            mod_len = int(total_words % ideal_size) #calculate iterations
            new_content = []
            for j in range(mod_len):
                if end > total_words:
                    end = total_words
                new_content = words[start:end]
                new_content_string = ' '.join(new_content)
                new_content_token_len = num_tokens_from_string(new_content_string)
                #check for 0 token entries
                if new_content_token_len > 0:
                    new_list.append([df['title'][i], new_content_string, df['url'][i], new_content_token_len])
                start += ideal_size
                end += ideal_size

    # Helper function: get embeddings for a text
    def get_embeddings(text):
       response = openai.Embedding.create(
           model="text-embedding-ada-002",
           input = text.replace("\n"," ")
       )
       embedding = response['data'][0]['embedding']
       return embedding

    # Create embeddings for each piece of content
    for i in range(len(new_list)):
       text = new_list[i][1]
       embedding = get_embeddings(text)
       new_list[i].append(embedding)

    # Create a new dataframe from the list
    df_new = pd.DataFrame(new_list, columns=['title', 'content', 'url', 'tokens', 'embeddings'])
    df_new.head()

    # Save the dataframe with embeddings as a CSV file for later use
    df_new.to_csv('blog_data_and_embeddings.csv', index=False)

    print("Done! Check the file blog_data_and_embeddings.csv for your results.")    
    ```

1.  Run the script using the `python create_embeddings.py` command.
    You should see an output that looks a bit like this:

    ```bash
    Estimated price to embed this content = $0.0060178
    Done! Check the file blog_data_and_embeddings.csv for your results.   
    ```

1.  To insert these embeddings into Timescale using the `pgvector` extension,
    open an editor of your choice and create the `insert_embeddings.py` file.

    ```python
    ###############################################################################
    # insert_embeddings.py
    # This script inserts OpenAI embedding vectors into a PostgreSQL database
    # using pgvector, a PostgreSQL extension for vector similarity search
    ###############################################################################
    import openai
    import os
    import pandas as pd
    import numpy as np
    import psycopg2
    import ast
    import pgvector
    import math
    from psycopg2.extras import execute_values
    from pgvector.psycopg2 import register_vector

    ###############################################################################
    # Setup your database to insert embeddings
    ###############################################################################
    # Get Timescale / PostgreSQL database connection string by reading local .env file
    connection_string  = os.environ['TIMESCALE_CONNECTION_STRING']

    # Connect to PostgreSQL database in Timescale using connection string
    conn = psycopg2.connect(connection_string)
    cur = conn.cursor()

    #install pgvector in your database
    cur.execute("CREATE EXTENSION IF NOT EXISTS vector;");
    conn.commit()

    # Register the vector type with psycopg2
    register_vector(conn)
    # Create table to store embeddings and metadata
    table_create_command = """
    CREATE TABLE embeddings (
                id bigserial primary key, 
                title text,
                url text,
                content text,
                tokens integer,
                embedding vector(1536)
                );
                """

    cur.execute(table_create_command)
    cur.close()
    conn.commit()
    ###############################################################################

    # Import embeddings into data frame
    # Note: Embeddings were created in create_embeddings.py
    df = pd.read_csv('blog_data_and_embeddings.csv')
    titles = df['title']
    urls = df['url']
    contents = df['content']
    tokens = df['tokens']
    embeds = [list(map(float, ast.literal_eval(embed_str))) for embed_str in df['embeddings']]

    df_new = pd.DataFrame({
        'title': titles,
        'url': urls,
        'content': contents,
        'tokens': tokens,
        'embeddings': embeds
    })

    print(df_new.head())

    ###############################################################################
    # Batch insert embeddings and metadata into database with psycopg2
    ###############################################################################
    register_vector(conn)
    cur = conn.cursor()

    # Prepare the list of tuples to insert
    data_list = [(row['title'], row['url'], row['content'], int(row['tokens']), np.array(row['embeddings'])) for index, row in df_new.iterrows()]
    # Use execute_values to perform batch insertion
    execute_values(cur, "INSERT INTO embeddings (title, url, content, tokens, embedding) VALUES %s", data_list)
    # Commit after we insert all embeddings
    conn.commit()

    cur.execute("SELECT COUNT(*) as cnt FROM embeddings;")
    num_records = cur.fetchone()[0]
    print("Number of vector records in table: ", num_records,"\n")
    # Correct output should be 129

    # print the first record in the table, for sanity-checking
    cur.execute("SELECT * FROM embeddings LIMIT 1;")
    records = cur.fetchall()
    print("First record in table: ", records)
    # Create an index on the data for faster retrieval

    #calculate the index parameters according to best practices
    num_lists = num_records / 1000
    if num_lists < 10:
       num_lists = 10
    if num_records > 1000000:
       num_lists = math.sqrt(num_records)

    #use the cosine distance measure, which is what we'll later use for querying
    cur.execute(f'CREATE INDEX ON embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = {num_lists});')
    conn.commit()
    print("Index created on embeddings table")
    ```

1.  Run the script using the `python insert_embeddings.py` command.
    You should see an output that looks a bit like this:

    ```bash
    0  How to Build a Weather Station With Elixir, Ne...  ...  [0.021399984136223793, 0.021850213408470154, -...
    1  How to Build a Weather Station With Elixir, Ne...  ...  [0.01620873250067234, 0.011362895369529724, 0....
    2  How to Build a Weather Station With Elixir, Ne...  ...  [0.022517921403050423, -0.0019158280920237303,...
    3  CloudQuery on Using PostgreSQL for Cloud Asset...  ...  [0.008915113285183907, -0.004873732570558786, ...
    4  CloudQuery on Using PostgreSQL for Cloud Asset...  ...  [0.0204352755099535, 0.010087345726788044, 0.0...

    [5 rows x 5 columns]
    Number of vector records in table:  129 

    First record in table:  [(1, 'How to Build a Weather Station With Elixir, Nerves, and TimescaleDB', 'https://www.timescale.com/blog/how-to-build-a-weather-station-with-elixir-nerves-and-timescaledb/', 'This is an installment of our “Community Member Spotlight” series, where we invite our customers to share their work, shining a light on their success and inspiring others with new ways to use technology to solve problems.In this edition,Alexander Koutmos, author of the Build a Weather Station with Elixir and Nerves book, joins us to share how he uses Grafana and TimescaleDB to store and visualize weather data collected from IoT sensors.About the teamThe bookBuild a Weather Station with Elixir and Nerveswas a joint effort between Bruce Tate, Frank Hunleth, and me.I have been writing software professionally for almost a decade and have been working primarily with Elixir since 2016. I currently maintain a few Elixir libraries onHexand also runStagira, a software consultancy company.Bruce Tateis a kayaker, programmer, and father of two from Chattanooga, Tennessee. He is the author of more than ten books and has been around Elixir from the beginning. He is the founder ofGroxio, a company that trains Elixir developers.Frank Hunlethis an embedded systems programmer, OSS maintainer, and Nerves core team member. When not in front of a computer, he loves running and spending time with his family.About the projectIn the Pragmatic Bookshelf book,Build a Weather Station with Elixir and Nerves, we take a project-based approach and guide the reader to create a Nerves-powered IoT weather station.For those unfamiliar with the Elixir ecosystem,Nervesis an IoT framework that allows you to build and deploy IoT applications on a wide array of embedded devices. At a high level, Nerves allows you to focus on building your project and takes care of a lot of the boilerplate associated with running Elixir on embedded devices.The goal of the book is to guide the reader through the process of building an end-to-end IoT solution for capturing, persisting, and visualizing weather data.Assembled weather station hooked up to development machine.One of the motivating factors for this book was to create a real-world project where readers could get hands-on experience with hardware without worrying too much about the nitty-gritty of soldering components together. Experimenting with hardware can often feel intimidating and confusing, but with Elixir and Nerves, we feel confident that even beginners get comfortable and productive quickly. As a result, in the book, we leverage a Raspberry Pi Zero W along with a few I2C enabled sensors to', 501, array([ 0.02139998,  0.02185021, -0.00537814, ..., -0.01257126,
       -0.02165324, -0.03714396], dtype=float32))]
    Index created on embeddings table
    ```

1.  To query the embeddings that you inserted in Timescale, open an editor of
    your choice and create the `query_embeddings.py` file. Here, the query is
    `How does Density use Timescale?`.

    ```python
    ###############################################################################
    # query_embeddings.py
    # This script shows how to query embeddings stored in PostgreSQL
    # to find relevant documents for a given query
    # and use them to augment a base LLM to answer questions
    ###############################################################################
    import openai
    import os
    import pandas as pd
    import numpy as np
    import json
    import tiktoken
    import psycopg2
    import ast
    import pgvector
    import math
    from psycopg2.extras import execute_values
    from pgvector.psycopg2 import register_vector

    # Get openAI api key by reading local .env file
    from dotenv import load_dotenv, find_dotenv
    _ = load_dotenv(find_dotenv()) 
    openai.api_key  = os.environ['OPENAI_API_KEY']

    # Get Timescale / PostgreSQL database connection string by reading local .env file
    connection_string  = os.environ['TIMESCALE_CONNECTION_STRING']

    # Connect to PostgreSQL database in Timescale using connection string
    conn = psycopg2.connect(connection_string)

    ###############################################################################
    # Helper functions for similarity search on documents in the database
    ###############################################################################
    # Helper function: Get top 3 most similar documents from the database
    def get_top3_similar_docs(query_embedding, conn):
        embedding_array = np.array(query_embedding)
        # Register pgvector extension
        register_vector(conn)
        cur = conn.cursor()
        # Get the top 3 most similar documents using the KNN <=> operator
        cur.execute("SELECT content FROM embeddings ORDER BY embedding <=> %s LIMIT 3", (embedding_array,))
        top3_docs = cur.fetchall()
        return top3_docs

    # Helper function: get text completion from OpenAI API
    # Note we're using the latest gpt-3.5-turbo-0613 model
    # Change the model type to whichever model you prefer (e.g gpt-4)
    def get_completion_from_messages(messages, model="gpt-3.5-turbo-0613", temperature=0,   max_tokens=1000):
        response = openai.ChatCompletion.create(
            model=model,
            messages=messages,
            temperature=temperature, 
            max_tokens=max_tokens, 
        )
        return response.choices[0].message["content"]

    # Helper function: get embeddings for a text
    def get_embeddings(text):
        response = openai.Embedding.create(
            model="text-embedding-ada-002",
            input = text.replace("\n"," ")
        )
        embedding = response['data'][0]['embedding']
        return embedding
    ###############################################################################

    ###############################################################################
    # Function to process user input 
    # with retrieval of most similar documents from the database
    # and completion from OpenAI API using Retrieval-Augmented Generation
    ###############################################################################
    def process_input_with_retrieval(user_input):
        delimiter = "```"

        #Step 1: Get documents related to the user input from database
        related_docs = get_top3_similar_docs(get_embeddings(user_input), conn)

        # Step 2: Get completion from OpenAI API
        # Set system message to help set appropriate tone and context for model
        system_message = f"""
        You are a friendly chatbot. \
        You can answer questions about timescaledb, its features and its use cases. \
        You respond in a concise, technically credible tone. \
        """

        # Prepare messages to pass to model
        # We use a delimiter to help the model understand the where the user_input starts and ends
        messages = [
            {"role": "system", "content": system_message},
            {"role": "user", "content": f"{delimiter}{user_input}{delimiter}"},
            {"role": "assistant", "content": f"Relevant Timescale case studies information: \n {related_docs[0] [0]} \n {related_docs[1][0]} {related_docs[2][0]}"}   
        ]

        final_response = get_completion_from_messages(messages)
        return final_response
    ###############################################################################

    # Question about a Timescale blog post we want the model to answer
    input = "How does Density use Timescale?"
    # Get a response from the model using most reelvant documents from the database
    response = process_input_with_retrieval(input)
    print(input)
    print(response)
    ```

1.  Run the script using the `python query_embeddings.py` command.
    You should see an output that looks a bit like this:

    ```bash
    How does Density use Timescale?
    Density uses TimescaleDB as the main database in their smart city system. They store counts of people in spaces over time and derive metrics such as dwell time and space usage. TimescaleDB's flexibility and ability to handle time-series data efficiently allows Density to slice, dice, and compose queries in various ways. They also leverage TimescaleDB's continuous aggregates feature to roll up high-resolution data to lower resolutions, improving query performance. Additionally, TimescaleDB's support for percentile calculations has helped Density deliver accurate percentile values for their data. Overall, TimescaleDB has significantly improved the performance and scalability of Density's analytics workload.
    ```

</Procedure>

[pgvector-repo]: https://github.com/pgvector/pgvector/blob/master/README.md
[vector-embeddings]: https://platform.openai.com/docs/guides/embeddings/what-are-embeddings
[rag-docs]: https://www.promptingguide.ai/techniques/rag
[cloud-login]: https://console.cloud.timescale.com/
[openai-signup]: https://platform.openai.com/overview
[api-key]:https://platform.openai.com/account/api-keys
[timescale-pgvector]: https://github.com/timescale/vector-cookbook/tree/main/openai_pgvector_helloworld
[developer-qa]: https://www.timescale.com/blog/tag/dev-q-a/
