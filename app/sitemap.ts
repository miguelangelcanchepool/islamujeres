import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

const paths = ["", "/la-isla", "/el-mar", "/lugares", "/la-mesa", "/vivirla", "/creditos"];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
