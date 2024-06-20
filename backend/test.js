const s = [
    {
        name: 'root', 
        itemtype: 'folder',
        items: [
            {
                name: 'ins1', 
                itemtype: 'folder',
                tree: 'root/ins1',
                items: [
                    {
                        name: 'ins2',
                        itemtype: 'folder',
                        tree: 'root/ins1/ins2',
                        items: [
                            {
                                name: 'ins3',
                                tree: 'root/ins1/ins2/ins3',
                                itemtype: 'folder',
                                items: []
                            }
                        ]
                    }
                ]
            },

            {
                name: 'an1', 
                itemtype: 'folder',
                tree: 'root/an1',
                items: [
                    {
                        name: 'an2',
                        tree: 'root/an1/an2',
                        itemtype: 'folder',
                        items: [
                            {
                                name: 'an3',
                                tree: 'root/an1/an2/an3',
                                itemtype: 'folder',
                                items: []
                            }
                        ]
                    }
                ]
            }
        ]
    }
][0]

const sear = 'ins3'

const lop = (a) => {
    let val = null

    const rec = (r) => {
        for (let x of r.items)
        {
            if (x.name === sear)
            {
                val = x
                return
            }
    
            if (x.itemtype === 'folder')
            {
                rec(x)
            }
        }
    }
    
    rec(a)
    console.log(val)
}

lop(s)

// console.log(
//     JSON.stringify(d, 0, 2)
// )