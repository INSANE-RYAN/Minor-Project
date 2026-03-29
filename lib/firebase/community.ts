import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  limit,
  increment,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore"
import { db } from "./config"

export interface FirebaseCommunityTip {
  id?: string
  title: string
  content: string
  authorId: string
  authorName: string
  authorAvatar?: string
  category: string
  likes: number
  likedBy: string[]
  tags: string[]
  createdAt: any
  updatedAt: any
}

export const addCommunityTip = async (
  tipData: Omit<FirebaseCommunityTip, "id" | "likes" | "likedBy" | "createdAt" | "updatedAt">,
): Promise<string> => {
  try {
    const tip: Omit<FirebaseCommunityTip, "id"> = {
      ...tipData,
      likes: 0,
      likedBy: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "community", "tips", "posts"), tip)
    return docRef.id
  } catch (error) {
    console.error("Error adding community tip:", error)
    throw error
  }
}

export const updateCommunityTip = async (
  tipId: string,
  authorId: string,
  updates: Partial<Omit<FirebaseCommunityTip, "id" | "authorId" | "likes" | "likedBy" | "createdAt">>,
): Promise<void> => {
  try {
    const tipRef = doc(db, "community", "tips", "posts", tipId)
    const tipDoc = await getDoc(tipRef)

    if (tipDoc.exists() && tipDoc.data().authorId === authorId) {
      await updateDoc(tipRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      })
    } else {
      throw new Error("Unauthorized: You can only update your own tips")
    }
  } catch (error) {
    console.error("Error updating community tip:", error)
    throw error
  }
}

export const deleteCommunityTip = async (tipId: string, authorId: string): Promise<void> => {
  try {
    const tipRef = doc(db, "community", "tips", "posts", tipId)
    const tipDoc = await getDoc(tipRef)

    if (tipDoc.exists() && tipDoc.data().authorId === authorId) {
      await deleteDoc(tipRef)
    } else {
      throw new Error("Unauthorized: You can only delete your own tips")
    }
  } catch (error) {
    console.error("Error deleting community tip:", error)
    throw error
  }
}

export const getCommunityTips = async (category?: string, limitCount = 20): Promise<FirebaseCommunityTip[]> => {
  try {
    let q = query(collection(db, "community", "tips", "posts"), orderBy("createdAt", "desc"), limit(limitCount))

    if (category && category !== "all") {
      q = query(
        collection(db, "community", "tips", "posts"),
        where("category", "==", category),
        orderBy("createdAt", "desc"),
        limit(limitCount),
      )
    }

    const querySnapshot = await getDocs(q)
    const tips: FirebaseCommunityTip[] = []

    querySnapshot.forEach((doc) => {
      tips.push({
        id: doc.id,
        ...doc.data(),
      } as FirebaseCommunityTip)
    })

    return tips
  } catch (error) {
    console.error("Error getting community tips:", error)
    throw error
  }
}

export const getPopularCommunityTips = async (limitCount = 10): Promise<FirebaseCommunityTip[]> => {
  try {
    const q = query(
      collection(db, "community", "tips", "posts"),
      orderBy("likes", "desc"),
      orderBy("createdAt", "desc"),
      limit(limitCount),
    )

    const querySnapshot = await getDocs(q)
    const tips: FirebaseCommunityTip[] = []

    querySnapshot.forEach((doc) => {
      tips.push({
        id: doc.id,
        ...doc.data(),
      } as FirebaseCommunityTip)
    })

    return tips
  } catch (error) {
    console.error("Error getting popular community tips:", error)
    throw error
  }
}

export const likeCommunityTip = async (tipId: string, userId: string): Promise<void> => {
  try {
    const tipRef = doc(db, "community", "tips", "posts", tipId)
    const tipDoc = await getDoc(tipRef)

    if (tipDoc.exists()) {
      const tip = tipDoc.data() as FirebaseCommunityTip
      const isLiked = tip.likedBy.includes(userId)

      if (isLiked) {
        // Unlike the tip
        await updateDoc(tipRef, {
          likes: increment(-1),
          likedBy: arrayRemove(userId),
          updatedAt: serverTimestamp(),
        })
      } else {
        // Like the tip
        await updateDoc(tipRef, {
          likes: increment(1),
          likedBy: arrayUnion(userId),
          updatedAt: serverTimestamp(),
        })
      }
    }
  } catch (error) {
    console.error("Error liking community tip:", error)
    throw error
  }
}
