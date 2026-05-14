"use client";

import { useMemo } from "react";
import CriticalImageBoot from "@/components/CriticalImageBoot";
import TemplateThree from "@/components/templates/TemplateThree";
import type { WeddingData } from "@/components/type/wedding";
import { TEMPLATE_THREE_CRITICAL_URLS } from "@/lib/weddingImageUrls";

export default function TemplateThreeWithBoot({ data }: { data: WeddingData }) {
  const urls = useMemo(
    () => [...TEMPLATE_THREE_CRITICAL_URLS, ...(data.images ?? [])],
    [data.images],
  );

  return (
    <CriticalImageBoot urls={urls}>
      <TemplateThree data={data} />
    </CriticalImageBoot>
  );
}
