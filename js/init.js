import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js'
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js'

function init() {

    //Configurations
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize( window.innerWidth, window.innerHeight )
    document.body.appendChild( renderer.domElement )

    scene.background = new THREE.Color('#87CEEB')

    camera.position.z = 6
    camera.position.y = 6





    //Map
        const textureGround = new THREE.TextureLoader().load('textures/groundMario.jpg')
        const groundGeometry = new THREE.BoxGeometry(15, 1, 15)
        const groundMaterial = new THREE.MeshBasicMaterial({ map: textureGround })

        const ground = new THREE.Mesh(groundGeometry, groundMaterial)
        ground.position.y = -1.2


    
    //Player
        const loader = new GLTFLoader()
        let player
        let room

        loader.load('models/room.glb', (gltf) => {
            let object = gltf.scene
            room = object
            room.scale.set(2.2, 2.2, 2.2)
            room.position.y = -0.7
            scene.add(room)
        })

        loader.load('models/Xbot.glb', (gltf) => {

            let Clock = new THREE.Clock()
            const mixer = new THREE.AnimationMixer(gltf.scene)
            let action = mixer.clipAction(gltf.animations[2])
            action.play()

            document.addEventListener('keypress', (e) => {
                const Keys = {
                    w: {
                        rotate: camera.rotation.z - 3.13,
                        animation: 3
                    }, 
                    s: {
                        rotate: camera.rotation.z,
                        animation: 3
                    },
                    d: {
                        rotate: camera.rotation.z + 1.6,
                        animation: 3
                    },
                    a: {
                        rotate: camera.rotation.z - 1.6,
                        animation: 3
                    }
                }

                if (Keys[e.key]) {
                    //Desligar animations
                    action = mixer.clipAction(gltf.animations[2])
                    action.play()
                    action.stop()


                    //Carregar animations
                    player.rotation.y = Keys[e.key].rotate
                    action = mixer.clipAction(gltf.animations[3])
                    action.play()
                }
            })

            document.addEventListener('keyup', () => {
                action.stop()
                action = mixer.clipAction(gltf.animations[2])
                action.play()
            })

            function load() {
                requestAnimationFrame(load)

                mixer.update(Clock.getDelta())
            }

            load()

            player = gltf.scene
            player.position.y = -0.7
            player.scale.set(2, 2, 2)

            scene.add(player)

            camera.lookAt(player.position)
        })

    
    //Light
        const light = new THREE.DirectionalLight(0xffffff, 1.3)
        light.position.set(4, 20, 8)
        scene.add(light)

        const light2 = new THREE.DirectionalLight(0xFFE4C4, 2)
        light2.position.set(4, 3, 4)
        scene.add(light2)

    

    //OrbitControls
        const OrbitControl = new OrbitControls(camera, renderer.domElement)
        OrbitControl.maxDistance = 8
        OrbitControl.minDistance = 8
        OrbitControl.enablePan = false
        OrbitControl.maxPolarAngle = Math.PI / 4 - 0.05
        OrbitControl.minPolarAngle = Math.PI / 4 - 0.05
        OrbitControl.update()


    //Moviment
        document.addEventListener('keypress', (e) => {

            const Keys = {
                w: {
                    x: camera.position.x / 20,
                    z: camera.position.z / 20,
                    y: 0
                }, 
                s: {
                    x: -camera.position.x / 20,
                    z: -camera.position.z / 20,
                    y: 0
                },
                d: {
                    x: -camera.position.z / 20,
                    z: camera.position.x / 20,
                    y: 0 
                },
                a: {
                    x: camera.position.z / 20,
                    z: -camera.position.x / 20,
                    y: 0 
                }
            }

            room.position.z += Keys[e.key].z 
            room.position.x += Keys[e.key].x
            player.position.y += -Keys[e.key].y 
        })
        





    //Render
    function animate() {
        requestAnimationFrame( animate )

        renderer.render( scene, camera )
    }

    animate()


}


window.addEventListener('load', init())