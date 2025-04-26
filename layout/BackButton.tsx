"use client";

import Button from "@/components/ui/button/Button";
import useGoBack from "@/hooks/useGoBack";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
    const onback = useGoBack();
    return (
        <Button variant="outline" size="sm" onClick={onback}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
      </Button>
    );
}