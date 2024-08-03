// import { Client } from 'react-native-appwrite';

import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
    Storage,
  } from "react-native-appwrite";
  
import { Alert } from "react-native";


export const config = {
    endpoint: '',
    platform: '',
    projectId: '',
    databaseId: '',
    userCollectionId: '',
    videoCollectionId: '',
    storageId: '',
}

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    clothCollectionId,
    videoCollectionId,
    storageId,
} = config;

const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Register user
export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl,
            }
        );
        
        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

// Sign In
export const signIn = async (email, password) => {
    try {
        // Check if a session is already active
        // const sessions = await account.listSessions();
        // if (sessions.total > 0) {
        //     // If a session is active, delete the current session
        //     await account.deleteSession('current');
        // }

        // Create a new session
        const session = await account.createEmailPasswordSession(email, password);

        return session;
    } catch (error) {
        console.log(error);
        Alert.alert("Error", error.message);
        throw new Error(error.message);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt')]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search('title', query)]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const getUserPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('users', userId)]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export const getFilePreview = async (fileId, type) => {
    let fileUrl;

    try {
        if(type === 'video') {
            fileUrl = storage.getFileView(storageId, fileId);
        } 
        else if (type === 'image') {
            fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, 'top', 100);
        }
        else {
            throw new Error('Invalid file type');
        }

        if(!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

export const uploadFile = async (file, type) => {
    if(!file) return;

    const asset = { 
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri,
    };

    try {
        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        );

        const fileUrl = await getFilePreview(uploadedFile.$id, type);

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

export const createVideo = async (form) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video'),
        ]);

        const newPost = await databases.createDocument(
            databaseId,
            videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                users: form.userId
            }
        )

        return newPost;
    } catch (error) {
        throw new Error(error);
    }
}

export const updatePost = async (user, videoId) => {
    try {
        const saved = await isSaved(user, videoId);

        let updatedSavedVideos = [...(user.saved_videos || [])];

        if (saved) {
            updatedSavedVideos = updatedSavedVideos.filter(video => video.$id !== videoId);
        } else {
            updatedSavedVideos.push(videoId);
        }
        
        await databases.updateDocument(
            databaseId,
            userCollectionId,
            user.$id,
            {
                saved_videos: updatedSavedVideos
            }
        );
        
        // console.log('Video saved/unsaved successfully');
    } catch (error) {
        throw new Error(error);
    }
}

export const getSavedPosts = async (userId) => {
    try {
        const userDocument = await databases.getDocument(
            databaseId,
            userCollectionId,
            userId
        );

        const savedVideos = userDocument.saved_videos || [];

        const videoIds = savedVideos.map(video => video.$id);

        if (savedVideos.length === 0) {
            return []; // No saved videos
        }
        
        const videoPosts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('$id', videoIds)]
        );

        return videoPosts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const isSaved = async (user, videoId) => {
    try {
        const savedPosts = await getSavedPosts(user.$id);

        const savedVideoIds = savedPosts.map(post => post.$id);

        const result = savedVideoIds.includes(videoId);
        // console.log(videoId)
        // console.log(result)

        return result;
    } catch (error) {
        console.error("Error in isSaved:", error.message);
        throw new Error(error);
    }
}
