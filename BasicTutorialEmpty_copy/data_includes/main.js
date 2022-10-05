// Type code below this line.
PennController.ResetPrefix(null);

DebugOff()

Sequence("consent", "instructions", randomize("experimental-trial"), "send", "completion_screen")

newTrial("consent",
    newHtml("consent_form", "consent.html")
        .cssContainer({"width":"720px"})
        .checkboxWarning("You must consent before continuing")
        .print()
    ,
    newButton("continue", "Click to continue")
        .center()
        .print()
        .wait(getHtml("consent_form").test.complete()
            .failure(getHtml("consent_form").warn())
    )
)

newTrial("instructions",

    defaultText
        .cssContainer({"margin-bottom":"1em"})
        .center()
        .print()
    ,
    newText("instructions-1", "Welcome!")
    ,
    newText("instructions-2", "<p>In this experiment, you will hear and read a sentence, and see two images.</p>")  
    ,
    newText("instructions-3", "<b>Select the image that better matches the sentence:</b>")
    ,
    newText("instructions-4", "<p>Press the <b>F</b> key to select the image on the left.<br>Press the <b>J</b> key to select the image on the right.</p>")
    ,
    newText("instructions-5", "if you do not select an image by the time the audio finishes playing, <br> the experiment will skip to the next sentence")
    ,
    newText("instruction-6", "Please enter your id")
    ,
    newTextInput("input_ID")
        .cssContainer({"margin-bottom": "1em"})
        .center()
        .print()
    ,
    newButton("wait", "Click to start the experiment")
        .center()
        .print()
        .wait()
    ,
    newVar("ID")
        .global()
        .set(getTextInput("input_ID"))
)

Template("items.csv", row => 
    newTrial("experimental-trial",

        newTimer("break", 1000)
            .start()
            .wait()
        ,

        newAudio("audio", row.audio)
            .play()
        ,
        newTimer("timeout", row.duration)
            .start()
        ,
        newText("sentence", row.sentence)
            .center()
            .unfold(row.duration)
        ,
        newImage("plural", row.plural_image)
            .size(200,200)
        ,
        newImage("singular", row.singular_image)
            .size(200,200)
        ,
        newCanvas("side-by-side", 450, 200)
            .add(0,0,getImage("plural"))
            .add(250,0, getImage("singular"))
            .center()
            .print()
            .log()
        ,
        newSelector("selection")
            .add(getImage("plural"), getImage("singular"))
            .shuffle()
            .keys("F", "J")
            .log()
            .callback(getTimer("timeout").stop())
        ,
        getTimer("timeout")
            .wait()
    ) 
    .log("group", row.group)
    .log("row", row.item)
    .log("condition", row.inflection)
    .log("ID", getVar("ID"))
)

SendResults("send")

newTrial("completion_screen",
    newText("thanks", "Thank you for participating! You may now exit the window.")
        .center()
        .print()
    ,
    newButton("void", "")
        .wait()
)

