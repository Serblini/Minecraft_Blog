import React, { useState } from 'react'
import { Button, Form, Popover } from 'react-bootstrap'
import { useHistory } from 'react-router'
import { deleteDevice } from '../http/deviceAPI'
import { SHOP_ROUTE } from '../utils/consts'