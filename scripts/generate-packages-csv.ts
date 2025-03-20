import fs from "fs";
import { createObjectCsvWriter } from "csv-writer";
import axios from "axios";
import packageJson from "../package-backend.json";

interface Package {
  name: string;
  version: string;
  license?: string;
  repository?: string;
  npmLink: string;
}

async function getPackageInfo(packageName: string): Promise<Package> {
  try {
    const response = await axios.get(
      `https://registry.npmjs.org/${packageName}`
    );
    const data = response.data;
    return {
      name: packageName,
      version: data["dist-tags"].latest,
      license: data.license || "Unlicensed",
      repository:
        data.repository?.url?.replace("git+", "").replace(".git", "") || "",
      npmLink: `https://www.npmjs.com/package/${packageName}`,
    };
  } catch (error) {
    console.error(`Error fetching info for ${packageName}:`, error);
    return {
      name: packageName,
      version: "unknown",
      license: "unlicensed",
      repository: "unknown",
      npmLink: `https://www.npmjs.com/package/${packageName}`,
    };
  }
}

async function generateCsv(packageJson: any) {
  const packages = [
    ...Object.entries(packageJson.dependencies || {}),
    ...Object.entries(packageJson.devDependencies || {}),
  ];

  const csvWriter = createObjectCsvWriter({
    path: "packages-backend.csv",
    header: [
      { id: "name", title: "Package Name" },
      { id: "version", title: "Version" },
      { id: "license", title: "License" },
      { id: "repository", title: "Link" },
      { id: "npmLink", title: "NPM Link" },
    ],
  });

  const packageInfos: Package[] = [];

  for (const [name, version] of packages) {
    const info = await getPackageInfo(name);
    packageInfos.push(info);
  }

  await csvWriter.writeRecords(packageInfos);
}

generateCsv(packageJson);
