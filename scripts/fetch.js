let url = "https://01.kood.tech/api/graphql-engine/v1/graphql";

export const queryData = async(query, variables) => {
    let result = await fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query: query,
            variables: variables,
        }),
    });
    return result.json();
};