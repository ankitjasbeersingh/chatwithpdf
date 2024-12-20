import { ChatOpenAI } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatMistralAI, MistralAIEmbeddings } from "@langchain/mistralai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import {createHistoryAwareRetriever} from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import pineconeClient from "./pinecone";
import {PineconeStore} from "@langchain/pinecone";
import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";

// const model = new ChatOpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
//     modelName: "gpt-4o"
// });

const model = new ChatMistralAI({
    model: "mistral-large-latest",
    temperature: 0
  });

export async function generateDocs(docId:string){
    const { userId } = await auth();

    if(!userId){
        throw new Error("User not founds");
    }
    const firebaseRef = await adminDb.collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .get();

    const downloadUrl = firebaseRef.data()?.downloadUrl;

    if(!downloadUrl){
        throw new Error("Download URL not found");
    }

    console.log(`--- Download URL fetched successfully: ${downloadUrl} ---`);

    const response = await fetch(downloadUrl);

    const data = await response.blob();
    // Load the PDF document from the specified path
    console.log("--- Loading PDF document");
    const loader = new PDFLoader(data);
    const docs = await loader.load();
    
    // Split the loaded document into smaller parts for easier processing
    console.log("--- Splitting the document into smaller parts... ---");
    const splitter = new RecursiveCharacterTextSplitter();
    const splitDocs = await splitter.splitDocuments(docs);
    console.log(`--- Split into ${splitDocs.length} parts ---`);

    return splitDocs;
}

export const indexName = "chatwithpdfmistral";

async function namespaceExists(index: Index<RecordMetadata>, namespace:string){
    if(namespace === null) throw new Error("No namespace value provided.");
    const { namespaces } = await index.describeIndexStats();
    return namespaces?.[namespace] !== undefined;
}

export async function generateEmbeddingsInPineconeVectorStore(docId:string){
    
    const {userId} = await auth();
    
    if(!userId){
        throw new Error('User not found');
    }
    let pineconeVectorStore;

    console.log("--- Generating embeddings for split documents---");
    // const embeddings = new OpenAIEmbeddings(
    //     {
    //         apiKey: process.env.OPENAI_API_KEY, // In Node.js defaults to process.env.OPENAI_API_KEY
    //         batchSize: 512, // Default value if omitted is 512. Max is 2048
    //         model: "text-embedding-3-large",
    //     }
    // );

    const embeddings = new MistralAIEmbeddings({
        model: "mistral-embed"
      });

    const index = await pineconeClient.index(indexName);
    const namespaceAlreadyExists = await namespaceExists(index, docId);

    if(namespaceAlreadyExists){
        console.log(
            `--- Namespae ${docId} already exists, reusing existing embeddings... ---`
        )

        pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
            pineconeIndex: index,
            namespace: docId,
        });

        return pineconeVectorStore;
    } else {
        const splitDocs = await generateDocs(docId);

        console.log(`--- Storing the embeddings in namespace ${docId} in the ${indexName} Pinecone vector store... ---`);
        pineconeVectorStore = await PineconeStore.fromDocuments(
            splitDocs,
            embeddings,
            {
                pineconeIndex: index,
                namespace: docId,
            }
        );
        
    }

     
}