"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

interface LoginFormData {
    email: string;
    password: string;
    rememberMe: boolean;
}

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        try {
            // TODO: Implement actual login logic
            console.log("Login data:", data);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto px-4">
            <Card>
                <CardHeader className="text-center">
                    {/* NYK Cosmetics Logo/Branding */}
                    <div className="mb-4">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">NYK</span>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        NYK Cosmetics
                    </CardTitle>
                    <p className="text-gray-500 mt-2">Sign in to your account</p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            error={errors.email?.message}
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address",
                                },
                            })}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            error={errors.password?.message}
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters",
                                },
                            })}
                        />

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                                    {...register("rememberMe")}
                                />
                                <span className="text-sm text-gray-600">Remember me</span>
                            </label>

                            <a
                                href="#"
                                className="text-sm text-pink-600 hover:text-pink-700 hover:underline"
                            >
                                Forgot password?
                            </a>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
                            size="lg"
                            isLoading={isLoading}
                        >
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Don&apos;t have an account?{" "}
                            <a
                                href="#"
                                className="text-pink-600 hover:text-pink-700 font-medium hover:underline"
                            >
                                Contact Admin
                            </a>
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Footer */}
            <p className="mt-8 text-center text-sm text-gray-400">
                © {new Date().getFullYear()} NYK Cosmetics. All rights reserved.
            </p>
        </div>
    );
}
