// Maxenoz's AI Extension v2
// TurboWarp / PenguinMod OpenRouter AI Extension

(function (Scratch) {
    "use strict";

    class MXAI {

        constructor() {
            this.lastMessage = "";
            this.memory = "";
            this.permanentMemory = "";
            this.model = "openai/gpt-oss-20b:free";

            // Safe memory loading
            try {
                this.permanentMemory =
                    localStorage.getItem("mxai_memory") || "";
            } catch (e) {
                this.permanentMemory = "";
            }
        }


        getInfo() {
            return {
                id: "mxai",
                name: "Maxenoz's AI",

                color1: "#6C63FF",
                color2: "#5548CC",
                color3: "#4438AA",

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
                                defaultValue:
                                "openai/gpt-oss-20b:free"
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
                                defaultValue: "Remember this"
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
                                defaultValue: "Important"
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
                        opcode: "getLastMessage",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "last AI message"
                    }

                ]
            };
        }


        async askAI(args) {

            try {

                const result = await fetch(
                    "https://openrouter.ai/api/v1/chat/completions",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json",

                            "Authorization":
                            "Bearer " + args.KEY
                        },

                        body: JSON.stringify({

                            model: this.model,

                            messages: [

                                {
                                    role: "system",
                                    content:
                                    "Permanent memory:\n" +
                                    this.permanentMemory +

                                    "\n\nTemporary memory:\n" +
                                    this.memory
                                },

                                {
                                    role: "user",
                                    content: args.TEXT
                                }

                            ]

                        })
                    }
                );


                const data = await result.json();


                if (data.error) {
                    this.lastMessage =
                        "API Error: " +
                        data.error.message;

                    return this.lastMessage;
                }


                this.lastMessage =
                    data.choices[0]
                    .message
                    .content;


                return this.lastMessage;


            } catch (error) {

                this.lastMessage =
                    "Error: " + error.message;

                return this.lastMessage;
            }
        }



        setModel(args) {
            this.model = args.MODEL;
        }



        memorize(args) {
            this.memory += "\n" + args.TEXT;
        }



        setPermanentMemory(args) {

            this.permanentMemory = args.TEXT;

            try {
                localStorage.setItem(
                    "mxai_memory",
                    this.permanentMemory
                );
            } catch (e) {}

        }



        clearMemory() {

            this.memory = "";
            this.permanentMemory = "";

            try {
                localStorage.removeItem(
                    "mxai_memory"
                );
            } catch (e) {}

        }



        getMemory() {
            return this.permanentMemory;
        }



        getLastMessage() {
            return this.lastMessage;
        }

    }


    Scratch.extensions.register(
        new MXAI()
    );


})(Scratch);
