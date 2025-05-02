import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PostItemProp } from "../../../store/interfaces/postInterfaces";
import { GetAllPost, DeletePost } from "../../../services/PostServices";
import { Skeleton } from "@heroui/react";
import {  AnimatePresence } from "framer-motion"; // Import AnimatePresence
import PostItem from "./PostItem/PostItem";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const PostList: React.FC = () => {
    const { data = [], isLoading, isError, error } = useQuery<PostItemProp[]>({
        queryKey: ["posts"],
        queryFn: GetAllPost,
    });

    const queryClient = useQueryClient();
    const [posts, setPosts] = useState<PostItemProp[]>(data);

    useEffect(() => {
        setPosts(data);
    }, [data]);
    const deleteMutation = useMutation({
        mutationFn: DeletePost,
        onSuccess: (data) => {
            toast.success(data?.message);
            setPosts((prevPosts) =>
                prevPosts.filter((post) => post.post_id !== data?.post_id)
            );
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message);
        },
    });

    const handleDelete = (postId: number) => {
        deleteMutation.mutate(postId);
    };

    if (isLoading) {
        return (
            <div className="my-3 text-center">
                <Skeleton className="w-full h-32 rounded-lg" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="my-3 text-center">
                <p className="text-red-500">{error?.message || "An error occurred"}</p>
            </div>
        );
    }

    return (
        <div className="mt-3">
            <AnimatePresence> {/* Bọc danh sách post trong AnimatePresence */}
                {posts.map((post) => (
                    <PostItem
                        key={post.post_id.toString()}
                        post={post}
                        onDelete={handleDelete}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default PostList;