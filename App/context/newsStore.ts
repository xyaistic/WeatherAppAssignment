import axios from "axios";
import { create } from "zustand";
import { ApikeyNews } from "../constant/Api";
import { Alert } from "react-native";

export const useNewsStore = create((set) => ({
    news: null,
    latestNews: null,
    intrestedNews: null,
    setNews: (news: any) => set({ news }),
    clearNews: () => set({ news: null }),

    getAllNews: async (searchQuery: string) => {
        try {
            const response = await axios.get(`https://newsapi.org/v2/everything?q=${searchQuery}&apiKey=${ApikeyNews}`);
            set({ news: response?.data?.articles })
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    },
    getLatestnews: async () => {
        try {
            const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${ApikeyNews}`);
            set({ latestNews: response?.data?.articles })
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    },
    getIntresetedNews: async (selectedInterests: any) => {    
    if (!selectedInterests || selectedInterests.length === 0) {
        set({ intrestedNews: [] });
        return;
    }
    try {
        const query = selectedInterests.join(' OR ');
        const response = await axios.get(
            `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&apiKey=${ApikeyNews}`
        );

        set({ intrestedNews: response?.data?.articles });
    } catch (error) {
        console.error('Error fetching news:', error);
        Alert.alert('Error', 'Failed to fetch news');
    }
},
}));