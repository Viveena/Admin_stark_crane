import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface PageContent {
    id: number;
    content_json: any;
    image_url: string | null;
    is_visible: boolean;
    updated_by: number;
    updated_by_name: string;
    updated_at: string;
}

interface UsePageSectionProps {
    pageKey: string;
    sectionKey: string;
}

export const usePageSection = ({ pageKey, sectionKey }: UsePageSectionProps) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [meta, setMeta] = useState<PageContent | null>(null);

    const fetchPageData = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/pages/${pageKey}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const pageContent = response.data.content;
            setMeta(pageContent || null);

            const allContent = pageContent?.content_json || {};
            setData(allContent[sectionKey] || {});

            return allContent; // Return full content for usage in save
        } catch (err: any) {
            console.error('Error fetching page data:', err);
            // If 404, valid case, just no data yet
            if (err.response && err.response.status === 404) {
                setData({});
            } else {
                setError(err.message || 'Failed to fetch page data');
            }
            return {};
        } finally {
            setLoading(false);
        }
    }, [pageKey, sectionKey]);

    useEffect(() => {
        fetchPageData();
    }, [fetchPageData]);

    const saveSection = async (sectionData: any) => {
        try {
            const token = localStorage.getItem('token');
            // 1. Fetch latest to merge, in case other sections changed
            const currentFullContent = await fetchPageData();

            const updatedFullContent = {
                ...currentFullContent,
                [sectionKey]: sectionData
            };

            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/pages/${pageKey}`,
                {
                    content_json: updatedFullContent
                    // image_url: we might handle main page image separately if needed, 
                    // but for sections, images are usually inside content_json
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setMeta(response.data.content);
            setData(updatedFullContent[sectionKey]);
            return response.data;
        } catch (err: any) {
            console.error('Error saving section:', err);
            throw err;
        }
    };

    const uploadImage = async (file: File) => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('image', file);

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/upload/image`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response.data.url;
        } catch (err: any) {
            console.error('Error uploading image:', err);
            throw err;
        }
    }

    return { data, loading, error, meta, saveSection, uploadImage };
};
