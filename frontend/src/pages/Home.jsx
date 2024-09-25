import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ProductCard from '../components/ProductCard';
import { gsap } from 'gsap';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import HeadPhone from '../components/HeadPhone';

const banners = [
    { title: 'Product Name 1', description: 'See More description 1', link: '#product1', src: "https://marketplace.canva.com/EAFoEJMTGiI/1/0/1600w/canva-beige-aesthetic-new-arrival-fashion-banner-landscape-cNjAcBMeF9s.jpg" },
    { title: 'Product Name 2', description: 'See More description 2', link: '#product2', src: "https://marketplace.canva.com/EAFHG6sbLsQ/1/0/1600w/canva-brown-beige-simple-special-sale-banner-lQfPvhnznqs.jpg" },
    { title: 'Product Name 3', description: 'See More description 3', link: '#product3', src: "https://marketplace.canva.com/EAF3fxiMgHY/1/0/1600w/canva-black-white-bold-simple-fashion-product-promotion-landscape-banner-V-clBpZoamE.jpg" },
];

const Home = () => {
    const [activeBannerIndex, setActiveBannerIndex] = useState(0);
    const [userId, setUserId] = useState('');
    const [products, setProducts] = useState([]);
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);
    const titleRefs = useRef([]);
    const descriptionRefs = useRef([]);
    const iconRef = useRef(null);
    const scrollerRef = useRef(null);
    const elementRefs = useRef([]);

    useEffect(() => {
        const token = localStorage.getItem('urban_auth_token');
        if (token) {
            const decodedData = jwtDecode(token);
            setUserId(decodedData.id);
        }

        const interval = setInterval(() => {
            setActiveBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        titleRefs.current.forEach((titleRef, index) => {
            const descriptionRef = descriptionRefs.current[index];

            if (index === activeBannerIndex) {
                if (titleRef) {
                    gsap.fromTo(
                        titleRef,
                        { x: '-150%', opacity: 0 },
                        { x: '0%', opacity: 1, duration: 1.5, delay: 0.5 }
                    );
                }

                if (descriptionRef) {
                    gsap.fromTo(
                        descriptionRef,
                        { x: '-150%', opacity: 0 },
                        { x: '0%', opacity: 1, duration: 1.5, delay: 0.7 }
                    );
                }

                if (iconRef.current) {
                    gsap.fromTo(
                        iconRef.current,
                        { x: '150%', opacity: 0 },
                        { x: '0%', opacity: 1, duration: 1.5, delay: 1 }
                    );
                }
            } else {
                if (titleRef) {
                    gsap.to(titleRef, { x: '-150%', opacity: 0, duration: 1.5 });
                }

                if (descriptionRef) {
                    gsap.to(descriptionRef, { x: '-150%', opacity: 0, duration: 1.5 });
                }

                if (iconRef.current) {
                    gsap.to(iconRef.current, { x: '150%', opacity: 0, duration: 1.5 });
                }
            }
        });
    }, [activeBannerIndex]);

    useEffect(() => {
        if (userId) {
            axios
                .post('http://localhost:8000/', { userId })
                .then((res) => {
                    setProducts(res.data.allProducts);
                    setRecommendedProducts(res.data.recommendedProducts);
                })
                .catch((err) => console.log(err));
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            const token = localStorage.getItem('urban_auth_token');
            axios
                .post('http://localhost:8000/wishlist', { userId }, { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => {
                    setWishlistItems(res.data.wishlistItems);
                })
                .catch((err) => console.log(err));
        }
    }, [userId]);

    useEffect(() => {
        const scrollerWidth = scrollerRef.current.scrollWidth / 2;
        const scrollerAnimation = gsap.to(scrollerRef.current, {
            x: -scrollerWidth,
            duration: 20,
            ease: 'linear',
            repeat: -1,
            modifiers: {
                x: (x) => `${parseFloat(x) % scrollerWidth}px`,
            },
        });

        return () => scrollerAnimation.kill();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        gsap.fromTo(
                            entry.target,
                            { y: 50, scale: 0.8, opacity: 0 },
                            { y: 0, scale: 1, opacity: 1, duration: 1, stagger: 0.2 }
                        );
                    }
                });
            },
            { threshold: 0.1 }
        );

        elementRefs.current.forEach((element) => {
            if (element) observer.observe(element);
        });

        return () => {
            elementRefs.current.forEach((element) => {
                if (element) observer.unobserve(element);
            });
        };
    }, []);

    const isProductInWishlist = (productId) => {
        return wishlistItems.some((item) => item._id === productId);
    };

    return (
        <HomeContainer>
            {/* Banner */}
            <HeroSection>
                <p style={{
                    fontFamily: "Style Script, cursive",
                    fontSize: "3.5vh",
                    textAlign: "center",
                    paddingTop: "5vh",
                    background: "linear-gradient(165deg, rgba(254,1,154,1) 0%, rgba(255,235,249,1) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                }}>
                    Vergin Pink
                </p>
                <h1 style={{ color: "white", fontWeight: '500', textAlign: "center" }}>Vergin Pink Kitty Ears Headphone</h1>
                <Plate></Plate>
                <Shadow></Shadow>
                <BottomPurchase>
                    <div style={{display: "flex", alignItems: "center", width: "100%", gap: "5vh", color: "White"}}>
                        <p>Recommends</p>
                        <p>Colors</p>
                        <p>How to use</p>
                    </div>
                    <div style={{height: "4vh", width: "10vw", backgroundColor: "white", borderRadius: "5vh", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                        <p style={{fontSize: "1.5vh"}}>Show Now</p>
                        <button style={{height: "3vh", borderRadius: "2vh", padding: ".5vh 1vh"}}>$299.00</button>
                    </div>
                </BottomPurchase>
                <HeadPhone />
            </HeroSection>

            {/* Infinite text scroller */}
            <ScrollerContainer>
                <ScrollerContent ref={scrollerRef}>
                    GREED GRAB GAIN ● GREED GRAB GAIN ● GREED GRAB GAIN ● GREED GRAB GAIN ● GREED GRAB GAIN ● GREED GRAB GAIN ● GREED GRAB GAIN ● GREED GRAB GAIN ● GREED GRAB GAIN ●
                    GREED GRAB GAIN ● GREED GRAB GAIN ● GREED GRAB GAIN ● GREED GRAB GAIN ● GREED GRAB GAIN ● GREED GRAB GAIN ● GREED GRAB GAIN ● GREED GRAB GAIN ● GREED GRAB GAIN ●
                </ScrollerContent>
            </ScrollerContainer>

            {/* Best of Electronics */}
            <div style={{ padding: '2vh', marginTop: '5vh' }}>
                <h1 style={{ marginBottom: '2vh', fontWeight: '600', color: "white" }}>Best of Electronics</h1>
                <div style={{ display: 'flex', gap: '2vh', flexWrap: 'wrap' }}>
                    {products.filter(product => product.category === 'Electronics').slice(0, 4).map((product, i) => (
                        <ProductCard
                            key={i}
                            productId={product._id}
                            title={product.title}
                            price={product.price}
                            description={product.description}
                            images={product.images}
                            userId={userId}
                            isLiked={isProductInWishlist(product._id)}
                        />
                    ))}
                    {products.filter(product => product.category === 'Electronics').length > 4 && (
                        <a href="#">See all products</a>
                    )}
                </div>
            </div>

            {/* Best of Cloths */}
            <div style={{ padding: '2vh', marginTop: '5vh' }}>
                <h1 style={{ marginBottom: '2vh', fontWeight: '600', color: "white" }}>Best of Cloths</h1>
                <div style={{ display: 'flex', gap: '2vh', flexWrap: 'wrap' }}>
                    {products.filter((product) => product.category === 'Clothing').slice(0, 4).map((product, i) => (
                        <ProductCard
                            key={i}
                            productId={product._id}
                            title={product.title}
                            price={product.price}
                            description={product.description}
                            images={product.images}
                            userId={userId}
                            isLiked={isProductInWishlist(product._id)}
                        />
                    ))}
                    {products.filter(product => product.category === 'Clothing').length > 4 && (
                        <a href="#">See all products</a>
                    )}
                </div>
            </div>

            {/* Recommended Products */}
            {recommendedProducts.length > 0 && (
                <div style={{ padding: '2vh', marginTop: '5vh' }}>
                    <h1 style={{ marginBottom: '2vh', fontWeight: '600', color: "white" }}>Recommended Products</h1>
                    <div style={{ display: 'flex', gap: '2vh', flexWrap: 'wrap' }}>
                        {recommendedProducts.map((product, i) => (
                            <ProductCard
                                key={i}
                                productId={product._id}
                                title={product.title}
                                price={product.price}
                                description={product.description}
                                images={product.images}
                                userId={userId}
                                isLiked={isProductInWishlist(product._id)}
                            />
                        ))}
                        <a href="#">See all products</a>
                    </div>
                </div>
            )}

            {/* Watch Show Section */}
            <ModelWatchBanner>
                <div id='watchbannerbg'>
                    <p id='bannerside' ref={(el) => elementRefs.current.push(el)}>AVAILABLE IN TWO MODELS: <br /> BAND AND BAND STYLE.</p>
                    <div id='watchmodels'>
                        <h1 ref={(el) => elementRefs.current.push(el)}>Band features a rubber strap that seamlessly encases the device, making it ideal for sports and outdoor activities</h1>
                        <img src="https://t4.ftcdn.net/jpg/02/40/91/07/360_F_240910711_vtlsiIEI9Ku0PjZKrWeZtbXNkxpcHbx2.jpg" alt="Watch model 1" id="watchmodel1" ref={(el) => elementRefs.current.push(el)} />
                        <h3 ref={(el) => elementRefs.current.push(el)}>BAND SWIPE FEATURE</h3>
                        <p style={{ fontSize: "1.6vh", lineHeight: "3vh" }} id='bannerBottomText' ref={(el) => elementRefs.current.push(el)}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quod molestias dolorem animi, recusandae iure ab dignissimos aperiam suscipit sed natus placeat eveniet.</p>
                    </div>
                </div>
            </ModelWatchBanner>

        </HomeContainer>
    );
};

const HomeContainer = styled.div`
    height: auto;
    width: 100%;
    background-color: #161618;
`;

const HeroSection = styled.div`
    height: 90vh;
    width: 100%;
    background-color: #161618;
    position: relative;
`;

const ScrollerContainer = styled.div`
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    background-color: #f8f555;
    padding: 1rem 0;
    margin: 2rem 0;
    `;

const ScrollerContent = styled.div`
    display: inline-block;
    font-size: 1.5rem;
    font-weight: bold;
    `;

const ModelWatchBanner = styled.div`
    min-height: 90vh;
    width: 100%;
    margin-top: 5vh;
    display: flex;
    align-items: center;
    justify-content: center;

    #watchbannerbg {
        height: 100%;
        width: 98%;
        background-color: #F0EDE5;
        border-radius: 2vh;
        display: flex;
        justify-content: space-between;

        @media (max-width: 768px) {
            flex-direction: column;
        }

        #bannerside {
        padding-left: 2vh;
        padding-top: 5vh;
        font-size: 3vh;
        font-family: "Cinzel", serif;
        font-weight: 500;
        }
    }

    #watchmodels {
        position: relative;
        height: 100%;
        width: 60%;
        line-height: 5vh;
        padding-top: 5vh;
        padding-left: 2vh;

        @media (max-width: 768px) {
            width: 100%;
        };

        h1 {
        font-size: 6vh;
        font-family: 'Qochy';
        font-weight: 200;
        line-height: 7vh;
        margin-bottom: 5vh;
        };

        h3 {
        font-size: 2.5vh;
        };

        #watchmodel1{
            @media (max-width: 768px) {
                height: 25vh;
            }
        };

        #bannerBottomText{
            width: 45%;
            margin-bottom: 5vh;
            @media (max-width: 768px) {
                width: 90%;
            }
        }
    }
    `;

const Plate = styled.div`
    height: 8vh;
    width: 100%;
    background-color: #00b7ff;
    position: absolute;
    left: 50%;
    top: 73%;
    transform: translate(-50%, 40%); /* Center the plate */
    border-radius: 50%;
    filter: blur(200px);

`;
const Shadow = styled.div`
    height: 15vh;
    width: 100%;
    background-color: #b73aff;
    position: absolute;
    left: 50%;
    top: 20%;
    transform: translate(-50%, 40%); /* Center the plate */
    border-radius: 50%;
    opacity: 0.2;
    filter: blur(200px);
`;

const BottomPurchase = styled.div`
    height: 6vh;
    width: 95%;
    background-color: #fff; 
    position: absolute;
    top: 95%;
    left: 50%;
    transform: translate(-50%, -50%); 
    border-radius: 5vh;
    background: rgba(154, 154, 154, 0.12);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(8.7px);
    border: 1px solid rgba(177, 177, 177, 0.29);
    display: flex;
    align-items: center;
    padding: 0 5vh;
`;
export default Home;
