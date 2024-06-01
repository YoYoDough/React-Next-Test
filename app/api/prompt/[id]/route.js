import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

// GET (read)
export const GET = async (request, { params }) => {
    try {
        await connectToDB()

        const prompt = await Prompt.findById(params.id).populate("creator")
        if (!prompt) return new Response("Prompt Not Found", { status: 404 });

        return new Response(JSON.stringify(prompt), { status: 200 })

    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
}

//PATCH (update)
export const PATCH = async (request, { params }) => {
    const { prompt, tag } = await request.json();

    try {
        await connectToDB();

        // Find the existing prompt by ID
        const existingPrompt = await Prompt.findById(params.id);

        if (!existingPrompt) {
            return new Response("Prompt not found", { status: 404 });
        }

        // Update the prompt with new data
        existingPrompt.prompt = prompt;
        existingPrompt.tag = tag;

        await existingPrompt.save();

        return new Response("Successfully updated the Prompts", { status: 200 });
    } catch (error) {
        return new Response("Error Updating Prompt", { status: 500 });
    }
};

//DELETE (delete)
export const DELETE = async (request, { params }) => {
    try {
        console.log('Attempting to connect to the database...');
        await connectToDB();
        console.log('Connected to the database successfully.');

        // Log the params to ensure id is correct
        console.log('Deleting prompt with id:', params.id);

        // Ensure params.id is a valid ObjectId
        if (!params.id || !params.id.match(/^[0-9a-fA-F]{24}$/)) {
            console.error('Invalid prompt id:', params.id);
            return new Response("Invalid prompt id", { status: 400 });
        }

        // Find the prompt by ID and remove it
        const deletedPrompt = await Prompt.findByIdAndDelete(params.id);

        if (!deletedPrompt) {
            console.log('Prompt not found with id:', params.id);
            return new Response("Prompt not found", { status: 404 });
        }

        console.log('Prompt deleted successfully:', deletedPrompt);
        return new Response("Prompt deleted successfully", { status: 200 });
    } catch (error) {
        console.error("Error deleting prompt:", error);
        return new Response("Error deleting prompt: " + error.message, { status: 500 });
    }
};