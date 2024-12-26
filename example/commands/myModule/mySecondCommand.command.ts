export const name = "mySecondCommand";

export const meta = {};

export const handler = async (data: string) => {
    alert(data);
    return "Hello, World!";
};