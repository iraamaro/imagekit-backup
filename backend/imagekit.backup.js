import inquirer from 'inquirer'
import ImageKitOps from './controllers/imagekit.ops.js'

const downloadImage = async () => {
    console.info('\n')
    console.info(`\t📷 IMAGEKIT BACKUP`)
    console.info(
        `\t${new Date().toLocaleString('pt-BR', { hour12: false })}` +
        `\n\tIniciado processo...\n`
    )

    inquirer
        .prompt([
            {
                type: 'list',
                name: 'method',
                message: 'Choose the operation:',
                choices: ['1 - START', '2 - CANCEL']
            }
        ])
        .then(async method => {
            if (method.method.split('-')[0] == 1) {
                const imagekitOps = new ImageKitOps()
                let skip = 0
                let checkpoint = true
                let files = null
                let count = 0
                while (checkpoint == true) {
                    let response = await imagekitOps.listFiles(skip)
                    while (!response == true || response == null) {
                        imagekitOps.wait(1000 * 3)
                        console.info(`\nEstou no WHILE - listagem - skip${skip}\n`)
                        response = await imagekitOps.listFiles(skip)
                    }
                    if (Array.isArray(response) == true && response.length > 0) {
                        skip += 1000
                        for (let image of response) {
                            files = await imagekitOps.downloadImage(image)
                            while (!files == true || files == null || files == 0) {
                                imagekitOps.wait(1000 * 3)
                                console.info(`\nEstou no WHILE - download - skip${skip}\n`)
                                files = await imagekitOps.downloadImage(image)
                            }
                            if (files == 1) {
                                count += 1
                            }
                        }
                    }
                    else if (Array.isArray(response) == true && response.length == 0) {
                        checkpoint = false
                    }
                    if (count % 1000 == 0) {
                        console.info(`CONTAGEM = ${count}`)
                    }
                }
                console.info('\n')
                console.info(`\t📷 IMAGEKIT BACKUP`)
                console.info(
                    `\t${new Date().toLocaleString('pt-BR', { hour12: false })}` +
                    `\n\tFim...\n`
                )
            }
            else if (method.method.split('-')[0] == 2) {
                console.warn(`\nEND...\n`)
            }
            else {
                console.warn(`\nEND...\n`)
            }
        })
}

downloadImage()