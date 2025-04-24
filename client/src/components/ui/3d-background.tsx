import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeDBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 80;
    }
    
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );
    
    // Materials
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.15,
      color: new THREE.Color(0x6366f1), // Indigo color to match the primary color
      transparent: true,
    });
    
    // Points mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Add more particles for connections
    const connectionsGeometry = new THREE.BufferGeometry();
    const connectionsCount = 300;
    
    const connectionsArray = new Float32Array(connectionsCount * 3);
    
    for (let i = 0; i < connectionsCount * 3; i++) {
      connectionsArray[i] = (Math.random() - 0.5) * 100;
    }
    
    connectionsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(connectionsArray, 3)
    );
    
    const connectionsMaterial = new THREE.PointsMaterial({
      size: 0.2,
      color: new THREE.Color(0x10b981), // Teal color to match the secondary color
      transparent: true,
    });
    
    const connectionsMesh = new THREE.Points(
      connectionsGeometry,
      connectionsMaterial
    );
    scene.add(connectionsMesh);
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener("resize", handleResize);
    
    // Animation
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      particlesMesh.rotation.x += 0.0003;
      particlesMesh.rotation.y += 0.0005;
      
      connectionsMesh.rotation.x += 0.0004;
      connectionsMesh.rotation.y += 0.0002;
      
      // Mouse interaction
      particlesMesh.rotation.x += mouseY * 0.0003;
      particlesMesh.rotation.y += mouseX * 0.0003;
      
      connectionsMesh.rotation.x += mouseY * 0.0002;
      connectionsMesh.rotation.y += mouseX * 0.0002;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of geometries and materials
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      connectionsGeometry.dispose();
      connectionsMaterial.dispose();
      renderer.dispose();
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ pointerEvents: "none" }}
    />
  );
}
