import '@/css/Collection.css'
import CollectionHeader from './CollectionHeader'
import CollectionMovie from './Movie/CollectionMovie'
import CollectionFolder from './Folder/CollectionFolder'
import CollectionFile from './File/CollectionFile'


const Collection = () => {
    return (
        <main className="collection">

            <CollectionHeader />

            <section className="main-container">

                <CollectionFile />
                <CollectionMovie />
                <CollectionMovie />
                <CollectionFolder />
                <CollectionFolder />
                <CollectionFile />
                <CollectionFile />
                <CollectionFile />
                <CollectionMovie />


            </section>

        </main>
    )
}


export default Collection