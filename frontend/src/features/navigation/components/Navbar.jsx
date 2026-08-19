import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Button, Stack, useMediaQuery, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo } from '../../user/UserSlice';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { selectCartItems } from '../../cart/CartSlice';
import { selectLoggedInUser, logoutAsync } from '../../auth/AuthSlice';
import { selectWishlistItems } from '../../wishlist/WishlistSlice';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import TuneIcon from '@mui/icons-material/Tune';
import { selectProductIsFilterOpen, toggleFilters } from '../../products/ProductSlice';

export const Navbar=({isProductList=false})=> {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const userInfo=useSelector(selectUserInfo)
  const cartItems=useSelector(selectCartItems)
  const loggedInUser=useSelector(selectLoggedInUser)
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const theme=useTheme()
  const is480=useMediaQuery(theme.breakpoints.down(480))
  const is380=useMediaQuery(theme.breakpoints.down(380))

  const wishlistItems=useSelector(selectWishlistItems)
  const isProductFilterOpen=useSelector(selectProductIsFilterOpen)

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleToggleFilters=()=>{
    dispatch(toggleFilters())
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    dispatch(logoutAsync()).catch((error) => {
      console.error('Logout API error:', error);
    });
    
    window.location.href = '/login';
  };

  const settings = [
    {name:"Home",to:"/"},
    {name:'Profile',to: (loggedInUser?.isAdmin) ? ("/admin/profile"):("/profile")},
    {name: (loggedInUser?.isAdmin) ? ('Orders'):('My orders'), to: (loggedInUser?.isAdmin) ? ("/admin/orders") : ("/orders")},
  ];

  return (
    <AppBar position="sticky" sx={{backgroundColor:"white",boxShadow:"none",color:"text.primary"}}>
        <Toolbar sx={{ 
          p: { xs: 0.5, sm: 1 }, 
          height: { xs: '3.5rem', sm: '4rem' },
          display: "flex", 
          justifyContent: "space-between",
          flexWrap: 'wrap'
        }}>
          <Typography 
            variant="h6" 
            noWrap 
            component="a" 
            href="/" 
            sx={{ 
              fontSize: { xs: '0.8rem', sm: '1rem', md: '1.25rem' },
              fontWeight: 700, 
              letterSpacing: { xs: '.1rem', sm: '.2rem', md: '.3rem' }, 
              color: 'inherit', 
              textDecoration: 'none',
              mr: { xs: 1, sm: 2 }
            }}
          >
            The Lending Library
          </Typography>

          <Stack 
            flexDirection={'row'} 
            alignItems={'center'} 
            justifyContent={'center'} 
            columnGap={{ xs: 1, sm: 2 }}
          >
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar 
                  alt={userInfo?.name} 
                  src="null" 
                  sx={{ 
                    width: { xs: 28, sm: 32, md: 40 },
                    height: { xs: 28, sm: 32, md: 40 }
                  }}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {
                !(loggedInUser?.isAdmin) && 
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography component={Link} color={'text.primary'} sx={{textDecoration:"none"}} to="/donate" textAlign="center">Donate</Typography>
                </MenuItem>
              }

              {
                loggedInUser?.isAdmin && 
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography component={Link} color={'text.primary'} sx={{textDecoration:"none"}} to="/admin/add-product" textAlign="center">Add new Product</Typography>
                </MenuItem>
              }
              {settings.map((setting) => (
                <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
                  <Typography component={Link} color={'text.primary'} sx={{textDecoration:"none"}} to={setting.to} textAlign="center">{setting.name}</Typography>
                </MenuItem>
              ))}
              <MenuItem onClick={handleLogout}>
                <Typography color={'text.primary'} sx={{textDecoration:"none"}} textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
            <Typography 
              variant='h6' 
              fontWeight={300}
              sx={{
                fontSize: { xs: '0.7rem', sm: '0.9rem', md: '1rem' },
                display: { xs: 'none', sm: 'block' }
              }}
            >
              {is480 ? `${userInfo?.name.toString().split(" ")[0]}` : `Hey👋, ${userInfo?.name}`}
            </Typography>
            {loggedInUser?.isAdmin && 
              <Button 
                variant='contained' 
                onClick={()=>{navigate("/admin/dashboard")}}
                sx={{
                  fontSize: { xs: '0.6rem', sm: '0.8rem' },
                  padding: { xs: '4px 8px', sm: '6px 16px' }
                }}
              >
                Admin
              </Button>
            }
            <Stack sx={{flexDirection:"row",columnGap:{ xs: 0.5, sm: 1 },alignItems:"center",justifyContent:"center"}}>

            {
            cartItems?.length>0 && 
            <Badge  badgeContent={cartItems.length} color='error'>
              <IconButton onClick={()=>navigate("/cart")} size={is480 ? "small" : "medium"}>
                <ShoppingCartOutlinedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                </IconButton>
            </Badge>
            }
            
            {
              !loggedInUser?.isAdmin &&
                  <Stack>
                      <Badge badgeContent={wishlistItems?.length} color='error'>
                          <IconButton component={Link} to={"/wishlist"} size={is480 ? "small" : "medium"}>
                            <FavoriteBorderIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                          </IconButton>
                      </Badge>
                  </Stack>
            }
            {
              isProductList && 
              <IconButton 
                onClick={handleToggleFilters} 
                size={is480 ? "small" : "medium"}
              >
                <TuneIcon sx={{ 
                  color: isProductFilterOpen ? "black" : "",
                  fontSize: { xs: 20, sm: 24 }
                }}/>
              </IconButton>
            }
            
            </Stack>
          </Stack>
        </Toolbar>
    </AppBar>
  );
}