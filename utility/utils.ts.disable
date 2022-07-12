import { useEffect, useState } from "react";
import { isNullOrUndefined } from "util";

export interface PublicLink {
    url: string;
    type: string;
}

export const arrayHasValues = (arrayToCheck: Array<any>): boolean => {
    return !isNullOrUndefined(arrayToCheck) && Array.isArray(arrayToCheck) && arrayToCheck?.length > 0;
};

export const checkIfPublicLinkExists = (path): boolean => {
    return path && arrayHasValues(path?.results);
};

// Returns an array of public link objects
export const createPublicLinkUrls = (path): null | Array<PublicLink> => {
    if (checkIfPublicLinkExists(path)) {
        const publicLinks = [];
        path?.results?.forEach((publicLinkItem) => {
            if (arrayHasValues(publicLinkItem?.assetToPublicLink?.results)) {
                publicLinkItem.assetToPublicLink.results.forEach((asset) => {
                    const { relativeUrl, versionHash, resource } = asset;
                    if (relativeUrl && versionHash && resource) {
                        publicLinks.push({
                            url: `${process.env.FILE_DOMAIN_URL}/${relativeUrl}?${versionHash}`.replace('"', ""),
                            type: resource,
                        });
                    }
                });
            }
        });

        return publicLinks.length ? publicLinks : null;
    }
    return null;
};

// Find a public link by it's type (type is the resource property of the public link in this case)
export const findPublicLinkByType = (
    publicLinks: Array<PublicLink>,
    type: string,
    returnOnlyFirst = true
): Array<string> | string | null => {
    if (!Array.isArray(publicLinks) || isNullOrUndefined(publicLinks)) {
        return null;
    }

    const filteredPublicLinks = [];
    publicLinks.forEach((publicLink) => {
        if (publicLink.type === type) {
            filteredPublicLinks.push(publicLink.url);
        }
    });

    if (!filteredPublicLinks.length) {
        return null;
    }

    return returnOnlyFirst ? filteredPublicLinks[0] : filteredPublicLinks;
};

export const useHasMounted = () => {
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);
    return hasMounted;
};
