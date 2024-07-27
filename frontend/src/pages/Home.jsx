import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ProductCard from '../components/ProductCard';
import { gsap } from 'gsap';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';

const banners = [
    { title: 'Product Name 1', description: 'See More description 1', link: '#product1' },
    { title: 'Product Name 2', description: 'See More description 2', link: '#product2' },
    { title: 'Product Name 3', description: 'See More description 3', link: '#product3' },
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
            <BannerPosition>
                {banners.map((banner, index) => (
                    <BannerF key={index} isActive={index === activeBannerIndex}>
                        <div className="bannerBottom">
                            <div>
                                <h1 ref={(el) => (titleRefs.current[index] = el)}>{banner.title}</h1>
                                <p ref={(el) => (descriptionRefs.current[index] = el)}>{banner.description}</p>
                            </div>
                            <a
                                href={banners[activeBannerIndex].link}
                                className={`iconContainer ${index === activeBannerIndex ? 'visible' : ''}`}
                            >
                                <i className="fa-solid fa-arrow-right rotate-icon" ref={iconRef}></i>
                            </a>
                        </div>
                    </BannerF>
                ))}
            </BannerPosition>

            {/* Infinite text scroller */}
            <ScrollerContainer>
                <ScrollerContent ref={scrollerRef}>
                    GREED GRAB GAIN ● GREED GRAB GAIN ● GREED GRAB GAIN ● GREED GRAB GAIN ● GREED GRAB GAIN ● GREED GRAB GAIN ● GREED GRAB GAIN ● GREED GRAB GAIN ● GREED GRAB GAIN ●
                    GREED GRAB GAIN ● GREED GRAB GAIN ● GREED GRAB GAIN ● GREED GRAB GAIN ● GREED GRAB GAIN ● GREED GRAB GAIN ● GREED GRAB GAIN ● GREED GRAB GAIN ● GREED GRAB GAIN ●
                </ScrollerContent>
            </ScrollerContainer>

            {/* Best of Electronics */}
            <div style={{ padding: '2vh', marginTop: '5vh' }}>
                <h1 style={{ marginBottom: '2vh', fontWeight: '600' }}>Best of Electronics</h1>
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
                <h1 style={{ marginBottom: '2vh', fontWeight: '600' }}>Best of Cloths</h1>
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
                    <h1 style={{ marginBottom: '2vh', fontWeight: '600' }}>Recommended Products</h1>
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
`;

const BannerPosition = styled.div`
  height: 92.7vh;
  width: 100%;
  position: relative;
  overflow: hidden;
`;

const BannerF = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  transition: top 0.5s ease-in-out;

  .bannerBottom {
    position: absolute;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2vh;
    bottom: 2vh;
  }

  .rotate-icon {
    font-size: 4vh;
    color: #000000; /* Arrow color */
    transform: rotate(0);
    transition: transform 0.3s ease-in-out;
    cursor: pointer;
  }

  .rotate-icon:hover {
    transform: rotate(-35deg);
  }

  .iconContainer {
    height: 8vh;
    width: 8vh;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: white;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    position: absolute;
    right: 2vh;
    border: 1px solid black;
  }

  .iconContainer.visible {
    opacity: 1;
  }
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

export default Home;
