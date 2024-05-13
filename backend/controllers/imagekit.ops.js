import dotenv from 'dotenv'
import axios from 'axios'
import fs from 'fs'
import ImageKit from 'imagekit'

class ImageKitOps {
    listFiles = async (skip) => {
        const imageKit = new ImageKit({
            publicKey: `${dotenv.config().parsed.IMAGEKIT_PUB}`,
            privateKey: `${dotenv.config().parsed.IMAGEKIT_PRIV}`,
            urlEndpoint: `${dotenv.config().parsed.IMAGEKIT_URL}`
        })
        try {
            let response = imageKit.listFiles({
                skip: skip,
                limit: 1000,
                sort: 'DESC_CREATED'
            })
            return response
        }
        catch (error) {
            console.info(error)
            console.info(`\nErro ao listar arquivos\n`)
            return null
        }
    }
    downloadImage = async (image) => {
        try {
            let response = await axios.get(
                image.url,
                { responseType: 'stream' }
            )
            if (
                response.hasOwnProperty('status') == true
                && response.hasOwnProperty('data') == true
                && response.status == 200
            ) {
                const writer = fs.createWriteStream(
                    `${dotenv.config().parsed.DIR_BACKUP}/${image.name}`
                )
                response.data.pipe(writer)
                return new Promise((resolve, reject) => {
                    writer.on('finish', resolve(1))
                    writer.on('error', reject(0))
                })
            }
            else {
                throw new Error(response)
            }

        }
        catch (error) {
            console.info(error)
            console.info(`\nErro para download e/ou gravação do arquivo\n`)
            return null
        }
    }

    saveImage = async (response, image) => {
        try {
            
        } catch (error) {
            console.info(`\nErro ao salvar arquivo ${image}\n`)
            console.info(error)
            return null
        }
    }

    wait(ms) {
        var start = new Date().getTime()
        var end = start
        while (end < start + ms) {
            end = new Date().getTime()
        }
    }
}

export default ImageKitOps