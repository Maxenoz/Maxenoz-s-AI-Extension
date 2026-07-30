// Maxenoz's AI Extension
// Part 1: Core

(function(Scratch) {
    "use strict";

    class MXAI {
        constructor() {
            this.lastMessage = "";
            this.memory = "";
            this.permanentMemory = "";
            this.model = "openai/gpt-oss-20b:free";
            this.apiKey = "";
        }

        getInfo() {
            return {
                id: "mxai",
                name: "Maxenoz's AI Extension",
                color1: "#6C63FF",
                blocks: [
                    {
                        opcode: "askAI",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "ask AI [TEXT] with API key [KEY]",
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Hello!"
                            },
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "sk-or..."
                            }
                        }
                    },

                    {
                        opcode: "setModel",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "set model to [MODEL]",
                        arguments: {
                            MODEL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "openai/gpt-oss-20b:free"
                            }
                        }
                    },

                    {
                        opcode: "memorize",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "memorize [TEXT]",
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My name is..."
                            }
                        }
                    },

                    {
                        opcode: "setPermanentMemory",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "set permanent memory [TEXT]",
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Important information"
                            }
                        }
                    },

                    {
                        opcode: "clearMemory",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "clear memory"
                    },

                    {
                        opcode: "getMemory",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "permanent memory"
                    },

                    {
                        opcode: "lastMessage",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "last AI message"
                    }
                ]
            };
        }

      async askAI(args) {
    this.apiKey = args.KEY;

    const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.apiKey
            },
            body: JSON.stringify({
                model: this.model,
                messages: [
                    {
                        role: "system",
                        content: this.permanentMemory
                    },
                    {
                        role: "user",
                        content: args.TEXT
                    }
                ]
            })
        }
    );

    const data = await response.json();

    this.lastMessage =
        data.choices?.[0]?.message?.content ||
        "AI error";

    return this.lastMessage;
}

setModel(args) {
    this.model = args.MODEL;
}

memorize(args) {
    this.memory = args.TEXT;
}

setPermanentMemory(args) {
    this.permanentMemory = args.TEXT;
    localStorage.setItem("mxai_memory", this.permanentMemory);
}

clearMemory() {
    this.memory = "";
    this.permanentMemory = "";
    localStorage.removeItem("mxai_memory");
}

getMemory() {
    return this.permanentMemory;
}

lastMessage() {
    return this.lastMessage;
}
      
    }

    Scratch.extensions.register(new MXAI());

})(Scratch);
