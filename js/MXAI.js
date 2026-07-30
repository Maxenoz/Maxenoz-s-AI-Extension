// Maxenoz's AI Extension v2
// OpenRouter AI Extension for TurboWarp / PenguinMod

(function (Scratch) {
    "use strict";

    class MXAI {

        constructor() {
            this.lastMessage = "";

            this.memory = "";

            this.permanentMemory =
                localStorage.getItem("mxai_memory") || "";

            this.model =
                "openai/gpt-oss-20b:free";
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
                                defaultValue:
                                "My name is..."
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
                                defaultValue:
                                "Important information"
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

                const response = await fetch(
                    "https://openrouter.ai/api/v1/chat/completions",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

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


                const data =
                    await response.json();


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
                    "Connection error: " +
                    error.message;

                return this.lastMessage;
            }
        }



        setModel(args) {

            this.model = args.MODEL;

        }



        memorize(args) {

            this.memory +=
                "\n" + args.TEXT;

        }



        setPermanentMemory(args) {

            this.permanentMemory =
                args.TEXT;


            localStorage.setItem(
                "mxai_memory",
                this.permanentMemory
            );

        }



        clearMemory() {

            this.memory = "";

            this.permanentMemory = "";

            localStorage.removeItem(
                "mxai_memory"
            );

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
