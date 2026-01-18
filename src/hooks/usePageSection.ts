import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

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
    const [canEdit, setCanEdit] = useState<boolean>(false);

    const fetchPageData = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/pages/${pageKey}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const pageContent = response.data.content;
            setMeta(pageContent || null);

            // Set permissions
            if (response.data.permissions && typeof response.data.permissions.can_edit === 'boolean') {
                setCanEdit(response.data.permissions.can_edit);
            } else {
                setCanEdit(false); // Default to safe
            }

            const allContent = pageContent?.content_json || {};
            setData(allContent[sectionKey] || {});

            return allContent; // Return full content for usage in save
        } catch (err: any) {
            console.error('Error fetching page data:', err);
            // If 404, valid case, just no data yet
            if (err.response && err.response.status === 404) {
                setData({});
                // Try to extract permissions even from 404 if possible? 
                // Currently controller returns 200 with null content if empty, so 404 is real error or invalid key.
                // If it was the "empty content" 200 case, we handled it above.
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
        if (!canEdit) {
            toast.error("You are allowed to view only");
            return;
        }
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
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setMeta(response.data.content);
            setData(updatedFullContent[sectionKey]);
            toast.success("Section saved successfully");
            return response.data;
        } catch (err: any) {
            console.error('Error saving section:', err);
            toast.error(err.response?.data?.msg || "Failed to save section");
            throw err;
        }
    };

    const uploadImage = async (file: File) => {
        if (!canEdit) {
            toast.error("You are allowed to view only");
            return;
        }
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
            toast.error("Failed to upload image");
            throw err;
        }
    }

    return { data, loading, error, meta, saveSection, uploadImage, canEdit };
};
